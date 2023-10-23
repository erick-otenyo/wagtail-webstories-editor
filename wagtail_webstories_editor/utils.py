import json

from bs4 import BeautifulSoup


def add_video_cache(doc, cache_enabled):
    if not cache_enabled:
        return doc

    soup = BeautifulSoup(doc, 'html.parser')
    amp_videos = soup.findAll('amp-video')

    if amp_videos:
        for amp_video in amp_videos:
            amp_video.attrs["cache"] = "google"

    return str(soup)


def add_google_analytics(doc, google_analytics_id):
    default_config = get_default_google_analytics_config(google_analytics_id)

    amp_analytics_script = '''
    <script async="" custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
    '''

    amp_analytics_config = f'''
    <amp-analytics type="gtag" data-credentials="include">
      <script type="application/json">
        {json.dumps(default_config)}
      </script>
    </amp-analytics>
    '''

    soup = BeautifulSoup(doc, 'html.parser')

    head_tag = soup.find('head')
    script_tag = head_tag.find('script', src="https://cdn.ampproject.org/v0.js")

    if head_tag and script_tag:
        # Insert the amp-analytics configuration just before the <script> tag
        script_tag.insert_before(BeautifulSoup(amp_analytics_script, 'html.parser'))
        soup.body.insert(1, BeautifulSoup(amp_analytics_config, 'html.parser'))
        return str(soup)

    return doc


def get_default_google_analytics_config(google_analytics_id):
    config = {
        "vars": {
            "gtag_id": google_analytics_id,
            "config": {
                google_analytics_id: {
                    "groups": "default"
                }
            }
        },
        "triggers": {
            # Fired when a story page becomes visible.
            "storyProgress": {
                "on": "story-page-visible",
                "request": "event",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_progress",
                    "event_category": "${title}",
                    "event_label": "${storyPageIndex}",
                    "event_value": "${storyProgress}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when the last page in the story is shown to the user.
            # This can be used to measure completion rate.
            "storyEnd": {
                "on": "story-last-page-visible",
                "request": "event",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_complete",
                    "event_category": "${title}",
                    "event_label": "${storyPageCount}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when clicking an element that opens a tooltip (<a> or <amp-twitter>).
            "trackFocusState": {
                "on": "story-focus",
                "tagName": "a",
                "request": "click",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_focus",
                    "event_category": "${title}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when clicking on a tooltip.
            "trackClickThrough": {
                "on": "story-click-through",
                "tagName": "a",
                "request": "click",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_click_through",
                    "event_category": "${title}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when opening a drawer or dialog inside a story (e.g. page attachment).
            "storyOpen": {
                "on": "story-open",
                "request": "event",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_open",
                    "event_category": "${title}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when closing a drawer or dialog inside a story (e.g. page attachment).
            "storyClose": {
                "on": "story-close",
                "request": "event",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_close",
                    "event_category": "${title}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when the user initiates an interaction to mute the audio for the current story.
            "audioMuted": {
                "on": "story-audio-muted",
                "request": "event",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_audio_muted",
                    "event_category": "${title}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when the user initiates an interaction to unmute the audio for the current story.
            "audioUnmuted": {
                "on": "story-audio-unmuted",
                "request": "event",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_audio_unmuted",
                    "event_category": "${title}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when a page attachment is opened by the user.
            "pageAttachmentEnter": {
                "on": "story-page-attachment-enter",
                "request": "event",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_page_attachment_enter",
                    "event_category": "${title}",
                    "send_to": google_analytics_id
                }
            },
            # Fired when a page attachment is dismissed by the user.
            "pageAttachmentExit": {
                "on": "story-page-attachment-exit",
                "request": "event",
                "vars": {
                    "event_name": "custom",
                    "event_action": "story_page_attachment_exit",
                    "event_category": "${title}",
                    "send_to": google_analytics_id
                }
            }
        }
    }

    return config
