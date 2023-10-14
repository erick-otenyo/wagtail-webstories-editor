from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import WebStory


class WebStoryViewSet(SnippetViewSet):
    model = WebStory
    create_template_name = "wagtail_webstories_editor/create_webstory.html"
    edit_template_name = "wagtail_webstories_editor/edit_webstory.html"


register_snippet(WebStoryViewSet)
