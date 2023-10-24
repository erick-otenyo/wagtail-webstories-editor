import json

from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.admin_url_finder import AdminURLFinder
from wagtail.admin.panels import FieldPanel, PublishingPanel, InlinePanel
from wagtail.contrib.routable_page.models import RoutablePageMixin, path
from wagtail.contrib.settings.models import BaseSiteSetting
from wagtail.models import (
    DraftStateMixin,
    LockableMixin,
    RevisionMixin,
    WorkflowMixin,
    PreviewableMixin, Page, Orderable
)

from wagtail_webstories_editor import get_webstories_listing_page_model


class WebStoriesSetting(ClusterableModel, BaseSiteSetting):
    google_analytics_id = models.CharField(max_length=255, blank=True, null=True,
                                           verbose_name=_("Google Analytics Measurement ID"))
    using_legacy_analytics = models.BooleanField(default=False)
    video_cache = models.BooleanField(default=False)
    auto_advance = models.BooleanField(default=False)
    default_page_duration = models.IntegerField(default=7, blank=True, null=True)

    panels = [
        FieldPanel("google_analytics_id"),
        FieldPanel("using_legacy_analytics"),
        FieldPanel("video_cache"),
        FieldPanel("auto_advance"),
        FieldPanel("default_page_duration"),
        InlinePanel("publisher_logos", heading=_("Publisher Logos"), label=_("Logo"))
    ]

    @property
    def config(self):
        return {
            "googleAnalyticsId": self.google_analytics_id,
            "usingLegacyAnalytics": self.using_legacy_analytics,
            "videoCache": self.video_cache,
            "autoAdvance": self.auto_advance,
            "defaultPageDuration": self.default_page_duration,
        }


class WebStoriesPublisherLogo(Orderable):
    setting = ParentalKey(WebStoriesSetting, related_name="publisher_logos", on_delete=models.CASCADE)
    logo = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=False,
        on_delete=models.CASCADE,
        related_name="+",
        verbose_name=_("Logo")
    )
    default = models.BooleanField(default=False)


class WebStory(WorkflowMixin, DraftStateMixin, LockableMixin, RevisionMixin, PreviewableMixin, models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, default="Untitled", verbose_name=_("Title"))
    slug = models.CharField(max_length=255, blank=True, null=True, unique=True)
    config = models.JSONField(blank=True, null=True)
    html = models.TextField(blank=True, null=True)

    _revisions = GenericRelation("wagtailcore.Revision", related_query_name="web_story")
    workflow_states = GenericRelation(
        "wagtailcore.WorkflowState",
        content_type_field="base_content_type",
        object_id_field="object_id",
        related_query_name="web_story",
        for_concrete_model=False,
    )

    class Meta:
        verbose_name = _("Web Story")
        verbose_name_plural = _("Web Stories")
        ordering = ["first_published_at", ]

    panels = [
        FieldPanel("title"),
        FieldPanel("slug"),
        FieldPanel("config"),
        FieldPanel("html"),
        PublishingPanel(),
    ]

    def __str__(self):
        return self.title

    @property
    def poster_image_url(self):
        try:
            featured_media = self.config.get("featuredMedia")
            if featured_media and featured_media.get("url"):
                return featured_media.get("url")

            pages = self.config.get("storyData", {}).get("pages")

            for page in pages:
                elements = page.get("elements")
                for element in elements:
                    if element.get("type") == "image":
                        return element.get("resource").get("src")

        except Exception:
            pass

        return None

    def slug_is_available(self, candidate_slug):
        siblings = WebStory.objects.all()

        if self.pk:
            siblings = siblings.exclude(pk=self.pk)

        return not siblings.filter(slug=candidate_slug).exists()

    def full_clean(self, *args, **kwargs):
        candidate_slug = self.slug
        if candidate_slug:
            suffix = 1
            while not self.slug_is_available(candidate_slug):
                suffix += 1
                candidate_slug = "%s-%d" % (self.slug, suffix)
        self.slug = candidate_slug

        super().full_clean(*args, **kwargs)

    @property
    def json_config(self):
        return json.dumps(self.config)

    @property
    def revisions(self):
        return self._revisions

    def get_preview_template(self, request, preview_mode):
        return f"wagtail_webstories_editor/story_detail.html"

    def get_preview_context(self, request, preview_mode):
        return {"story": self}

    def get_parent_link(self, request=None):
        WebStoyListPage = get_webstories_listing_page_model()
        if WebStoyListPage:
            list_page = WebStoyListPage.objects.live().first()
            return list_page.get_full_url(request)
        return None

    def get_link(self, request=None):
        parent_link = self.get_parent_link(request)
        if parent_link:
            suffix = str(self.pk)
            if self.slug:
                suffix = self.slug
            return parent_link + suffix

        return ""

    def get_permalink_template(self, request=None):
        parent_link = self.get_parent_link(request)

        if parent_link:
            return parent_link + "%pagename%/"

        return ""

    def get_story_dashboard_config(self, request=None):
        finder = AdminURLFinder()
        edit_url = finder.get_edit_url(self)

        story = self.get_latest_revision_as_object()

        if request:
            edit_url = request.build_absolute_uri(edit_url)

        created_at = story.last_published_at or story.created_at

        story_data = {
            "id": story.pk,
            "title": self.title,
            "created": created_at.strftime("%Y-%m-%dT%H:%M:%S"),
            "createdGmt": created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "status": "publish" if self.live else "draft",
            "bottomTargetAction": edit_url,
            "editStoryLink": edit_url,
            "capabilities": {
                "hasEditAction": True,
                "hasDeleteAction": False
            },
        }

        try:
            if story.config and story.config.get("featuredMedia"):
                featuredMedia = story.config.get("featuredMedia")
                if featuredMedia and featuredMedia.get("url"):
                    story_data.update({"featuredMediaUrl": featuredMedia.get("url")})
        except Exception:
            pass

        if self.latest_revision:
            story_data.update({
                "modified": self.latest_revision.created_at.strftime("%Y-%m-%dT%H:%M:%SZ")
            })

        link = self.get_link(request)

        if self.live and link:
            story_data.update({
                "link": link,
                "previewLink": link
            })

        return story_data


class AbstractWebStoryListPage(RoutablePageMixin, Page):
    # we should only have one instance of the listing page
    max_count = 1

    class Meta:
        abstract = True

    @property
    def live_stories(self):
        live_webstories_stories = WebStory.objects.filter(live=True).order_by("-last_published_at")
        return live_webstories_stories

    def get_sitemap_urls(self, request=None):
        list_page_sitemap_urls = super(AbstractWebStoryListPage, self).get_sitemap_urls(request)
        list_page_url = self.get_full_url(request=request)

        for story in self.live_stories:
            sitemap_url = {
                "lastmod": story.last_published_at
            }

            if story.slug:
                sitemap_url.update({
                    "location": list_page_url + story.slug
                })
            else:
                sitemap_url.update({
                    "location": list_page_url + str(story.pk)
                })

            list_page_sitemap_urls.append(sitemap_url)

        return list_page_sitemap_urls

    @path('<str:story_id>/')
    def web_story_page(self, request, story_id):
        """
        View function for web story
        """
        try:
            story_id = int(story_id)
            web_story = get_object_or_404(WebStory, live=True, pk=story_id)
        except ValueError:
            web_story = get_object_or_404(WebStory, live=True, slug=story_id)

        return self.render(
            request,
            context_overrides={
                'story': web_story,
            },
            template="wagtail_webstories_editor/story_detail.html"
        )
