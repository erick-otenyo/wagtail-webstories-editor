import json

from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from wagtail.api.v2.utils import get_full_url

from wagtail_webstories_editor.models import WebStory, WebStoriesSetting, WebStoriesPublisherLogo


def web_stories_list(request):
    web_stories = WebStory.objects.all().order_by("-last_published_at")
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

    for story_obj in page_obj:
        latest_revision = story_obj.get_latest_revision_as_object()
        story_data = latest_revision.get_story_dashboard_config(request)

        stories_data["stories"].update({latest_revision.pk: story_data})
        stories_data["fetchedStoryIds"].append(latest_revision.pk)

    return JsonResponse(stories_data)


def update_webstory(request, story_id):
    web_story = get_object_or_404(WebStory, pk=story_id)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get("title")

            if title:
                web_story.title = title
                config = web_story.get_latest_revision_as_object().config
                if config:
                    config["title"].update({"raw": title})
                web_story.config = config
                web_story.save_revision(changed=True, log_action=True)

        except Exception:
            pass

    latest_revision = web_story.get_latest_revision_as_object()
    story_config = latest_revision.get_story_dashboard_config(request)

    return JsonResponse(story_config)


def duplicate_webstory(request, story_id):
    web_story = get_object_or_404(WebStory, pk=story_id)

    latest_revision = web_story.get_latest_revision_as_object()

    title = latest_revision.title or "Untitled"

    new_story_data = {
        "title": title + " - Copy",
        "config": latest_revision.config,
        "html": latest_revision.html,
        "live": False
    }

    web_story_copy = WebStory(**new_story_data)
    web_story_copy.save()
    web_story_copy.save_revision(changed=True, log_action=True)

    latest_revision = web_story_copy.get_latest_revision_as_object()

    story_config = latest_revision.get_story_dashboard_config(request)

    return JsonResponse(story_config)


def handle_publisher_logos(request):
    web_stories_setting = WebStoriesSetting.for_request(request)

    if request.method == 'POST':
        logo_res = {}

        try:
            data = json.loads(request.body)
            default_logo_id = data.get("default_logo_id")
            image_id = data.get("id")

            if default_logo_id:
                logo_to_set = web_stories_setting.publisher_logos.filter(logo_id=default_logo_id).first()

                for p_logo in web_stories_setting.publisher_logos.all():
                    if p_logo.pk == logo_to_set.pk:
                        p_logo.default = True
                    else:
                        p_logo.default = False

                    p_logo.save()

                logo_res.update({
                    "id": logo_to_set.logo.id,
                    "url": get_full_url(request, logo_to_set.logo.file.url)
                })
            else:
                logo = WebStoriesPublisherLogo(logo_id=image_id)
                web_stories_setting.publisher_logos.add(logo)
                web_stories_setting.save()

                logo_res.update({
                    "id": logo.logo.id,
                    "url": get_full_url(request, logo.logo.file.url)
                })
        except Exception:
            pass

        return JsonResponse(logo_res)

    publisher_logos = web_stories_setting.publisher_logos.all()
    logos = []
    for logo in publisher_logos:
        logos.append({
            "id": logo.logo.id,
            "url": get_full_url(request, logo.logo.file.url),
            "active": logo.default,
        })

    return JsonResponse(logos, safe=False)


def handle_webstories_settings(request):
    web_stories_setting = WebStoriesSetting.for_request(request)

    if request.method == "POST":
        try:
            data = json.loads(request.body)

            for key, value in data.items():
                setattr(web_stories_setting, key, value)

            web_stories_setting.save()

        except Exception:
            pass

    res = web_stories_setting.config

    return JsonResponse(res)
