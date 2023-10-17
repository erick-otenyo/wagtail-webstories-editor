from django.urls import path
from wagtail import hooks
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import WebStory
from .views import web_stories_list, update_webstory, duplicate_webstory

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
    ]


@hooks.register("register_icons")
def register_icons(icons):
    for icon in WEBSTORIES_ICONS:
        icons.append("wagtail_webstories_editor/icons/{}".format(icon))
    return icons


class WebStoryViewSet(SnippetViewSet):
    model = WebStory
    create_template_name = "wagtail_webstories_editor/create_webstory.html"
    edit_template_name = "wagtail_webstories_editor/edit_webstory.html"
    index_template_name = "wagtail_webstories_editor/index_webstory.html"

    icon = "webstories"
    menu_label = "Web Stories"
    menu_name = "web_stories"
    menu_order = 900
    add_to_admin_menu = True


register_snippet(WebStoryViewSet)
