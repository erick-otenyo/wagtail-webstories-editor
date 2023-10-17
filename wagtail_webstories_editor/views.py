import json

from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from wagtail.admin.admin_url_finder import AdminURLFinder

from wagtail_webstories_editor import get_webstories_listing_page_model
from wagtail_webstories_editor.models import WebStory


def web_stories_list(request):
    web_stories = WebStory.objects.all()
    paginator = Paginator(web_stories, 20)

    stories_data = {
        "stories": {},
        "fetchedStoryIds": [],
        "totalPages": paginator.num_pages,
        "totalStoriesByStatus": {
            "all": paginator.count,
            "publish": web_stories.filter(live=True).count(),
        },
    }

    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    for story in page_obj:
        story_data = story.get_story_dashboard_config(request)

        stories_data["stories"].update({story.pk: story_data})
        stories_data["fetchedStoryIds"].append(story.pk)

    return JsonResponse(stories_data)


def update_webstory(request, story_id):
    web_story = get_object_or_404(WebStory, pk=story_id)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get("title")
            web_story.title = title
            web_story.save()
        except Exception:
            pass

    story_config = web_story.get_story_dashboard_config(request)

    return JsonResponse(story_config)


def duplicate_webstory(request, story_id):
    web_story = get_object_or_404(WebStory, pk=story_id)

    title = web_story.title or "Untitled"

    new_story_data = {
        "title": title + " - Copy",
        "config": web_story.config,
        "html": web_story.html,
        "live": False
    }

    web_story_copy = WebStory(**new_story_data)
    web_story_copy.save()
    web_story_copy.save_revision()

    story_config = web_story_copy.get_story_dashboard_config(request)

    return JsonResponse(story_config)
