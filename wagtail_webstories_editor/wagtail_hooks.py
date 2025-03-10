import json

from django.urls import path, reverse_lazy
from wagtail import hooks
from wagtail.log_actions import log
from wagtail.snippets.action_menu import DeleteMenuItem
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet, EditView, CreateView

from .models import WebStory, WebStoriesSetting
from .utils import add_video_cache, add_google_analytics
from .views import (
    web_stories_list,
    update_webstory,
    duplicate_webstory,
    handle_publisher_logos, handle_webstories_settings
)

WEBSTORIES_ICONS = [
    "webstories.svg",
    "webstories-logo-bw.svg",
    "webstories-logo-color.svg",
    "webstories-logo-with-type-bw.svg",
    "webstories-logo-with-type-circle-bw.svg",
    "webstories-logo-with-type-circle-color.svg",
]


@hooks.register("register_admin_urls")
def register_admin_urls():
    return [
        path("web-stories-list/", web_stories_list, name="web_stories_list"),
        path("web-stories-update/<int:story_id>/", update_webstory, name="web_stories_update"),
        path("web-stories-duplicate/<int:story_id>/", duplicate_webstory, name="web_stories_duplicate"),
        path("web-stories-publisher-logos/", handle_publisher_logos, name="web_stories_publisher_logos"),
        path("web-stories-settings/", handle_webstories_settings, name="web_stories_settings"),
    ]


@hooks.register("register_icons")
def register_icons(icons):
    for icon in WEBSTORIES_ICONS:
        icons.append("wagtail_webstories_editor/icons/{}".format(icon))
    return icons


class WebStoryVideoCacheCreateEditMixin:
    def get_context_data(self, **kwargs):
        web_stories_setting = WebStoriesSetting.for_request(self.request)
        
        context = super().get_context_data(**kwargs)
        
        config = {
            "globalAutoAdvance": web_stories_setting.auto_advance,
            "globalPageDuration": web_stories_setting.default_page_duration,
        }
        
        context.update({"editorConfig": json.dumps(config)})
        
        context.update({
            "documentChooserUrl": reverse_lazy("wagtaildocs_chooser:choose"),
            "imageChooserUrl": reverse_lazy("wagtailimages_chooser:choose"),
        })
        
        return context
    
    def save_instance(self):
        """
        Called after the form is successfully validated - saves the object to the db
        and returns the new object. Override this to implement custom save logic.
        """
        
        web_stories_setting = WebStoriesSetting.for_request(self.request)
        
        if self.draftstate_enabled:
            instance = self.form.save(commit=False)
            
            if web_stories_setting.video_cache and instance.html:
                html = add_video_cache(instance.html, web_stories_setting.video_cache)
                instance.html = html
            
            if web_stories_setting.google_analytics_id:
                html = add_google_analytics(instance.html, web_stories_setting.google_analytics_id)
                instance.html = html
            
            # If DraftStateMixin is applied, only save to the database in CreateView,
            # and make sure the live field is set to False.
            if self.view_name == "create":
                instance.live = False
                instance.save()
                self.form.save_m2m()
        else:
            instance = self.form.save(commit=False)
            
            if web_stories_setting.video_cache and instance.html:
                html = add_video_cache(instance.html, web_stories_setting.video_cache)
                instance.html = html
            
            if web_stories_setting.google_analytics_id:
                html = add_google_analytics(instance.html, web_stories_setting.google_analytics_id)
                instance.html = html
            
            instance.save()
        
        self.has_content_changes = self.view_name == "create" or self.form.has_changed()
        
        # Save revision if the model inherits from RevisionMixin
        self.new_revision = None
        if self.revision_enabled:
            self.new_revision = instance.save_revision(user=self.request.user)
        
        log(
            instance=instance,
            action="wagtail.create" if self.view_name == "create" else "wagtail.edit",
            revision=self.new_revision,
            content_changed=self.has_content_changes,
        )
        
        return instance


class WebStoryCreateView(WebStoryVideoCacheCreateEditMixin, CreateView):
    pass


class WebStoryEditView(WebStoryVideoCacheCreateEditMixin, EditView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        link = self.object.get_link(self.request)
        permalink_template = self.object.get_permalink_template(self.request)
        
        if link:
            context.update({"story_link": link})
        
        if permalink_template:
            context.update({"permalink_template": permalink_template})
        
        return context


class WebStoryViewSet(SnippetViewSet):
    model = WebStory
    create_template_name = "wagtail_webstories_editor/create_webstory.html"
    edit_template_name = "wagtail_webstories_editor/edit_webstory.html"
    index_template_name = "wagtail_webstories_editor/index_webstory.html"
    
    add_view_class = WebStoryCreateView
    edit_view_class = WebStoryEditView
    
    icon = "webstories"
    menu_label = "Web Stories"
    menu_name = "web_stories"
    menu_order = 900
    add_to_admin_menu = True


register_snippet(WebStoryViewSet)


@hooks.register('register_snippet_action_menu_item')
def register_delete_menu_item(model):
    # add delete to the menu
    if issubclass(model, WebStory):
        return DeleteMenuItem(order=70)
