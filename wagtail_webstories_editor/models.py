import json

from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from wagtail.admin.admin_url_finder import AdminURLFinder
from wagtail.admin.panels import FieldPanel, PublishingPanel
from wagtail.contrib.routable_page.models import RoutablePageMixin, path
from wagtail.models import (
    DraftStateMixin,
    LockableMixin,
    RevisionMixin,
    WorkflowMixin,
    PreviewableMixin, Page
)

from wagtail_webstories_editor import get_webstories_listing_page_model


class WebStory(WorkflowMixin, DraftStateMixin, LockableMixin, RevisionMixin, PreviewableMixin, models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, default="Untitled", verbose_name=_("Title"))
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
        FieldPanel("config"),
        FieldPanel("html"),
        PublishingPanel(),
    ]

    def __str__(self):
        return self.title

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

    def get_story_dashboard_config(self, request=None):
        WebStoyListPage = get_webstories_listing_page_model()
        list_page = None
        if WebStoyListPage:
            list_page = WebStoyListPage.objects.live().first()

        finder = AdminURLFinder()
        edit_url = finder.get_edit_url(self)

        if request:
            edit_url = request.build_absolute_uri(edit_url)

        story_data = {
            "id": self.pk,
            "title": self.title,
            "created": self.created_at.strftime("%Y-%m-%dT%H:%M:%S"),
            "createdGmt": self.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "status": "publish" if self.live else "draft",
            "bottomTargetAction": edit_url,
            "editStoryLink": edit_url,
            "capabilities": {
                "hasEditAction": True,
                "hasDeleteAction": False
            },
        }

        if self.latest_revision:
            story_data.update({
                "modified": self.latest_revision.created_at.strftime("%Y-%m-%dT%H:%M:%SZ")
            })

        if self.live and list_page:
            story_data.update({
                "link": list_page.get_full_url(request) + str(self.pk)
            })

        return story_data


class AbstractWebStoryListPage(RoutablePageMixin, Page):
    # we should only have one instance of the listing page
    max_count = 1

    class Meta:
        abstract = True

    @property
    def live_stories(self):
        live_webstories_stories = WebStory.objects.filter(live=True)
        return live_webstories_stories

    def get_sitemap_urls(self, request=None):
        list_page_sitemap_urls = super(AbstractWebStoryListPage, self).get_sitemap_urls(request)
        list_page_url = self.get_full_url(request=request)

        for story in self.live_stories:
            list_page_sitemap_urls.append({
                "location": list_page_url + str(story.pk),
                "lastmod": story.last_published_at,
            })

        return list_page_sitemap_urls

    @path('<int:story_id>/')
    def web_story_page(self, request, story_id):
        """
        View function for web story
        """
        web_story = get_object_or_404(WebStory, live=True, pk=story_id)

        return self.render(
            request,
            context_overrides={
                'story': web_story,
            },
            template="wagtail_webstories_editor/story_detail.html"
        )
