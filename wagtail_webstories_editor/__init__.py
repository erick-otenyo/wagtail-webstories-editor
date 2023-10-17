from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


def get_webstories_editor_listing_page_model_string():
    """
    Get the dotted ``app.Model`` name for the image model as a string.
    Useful for developers making Wagtail plugins that need to refer to the
    image model, such as in foreign keys, but the model itself is not required.
    """
    return getattr(settings, "WAGTAIL_WEBSTORIES_EDITOR_LISTING_PAGE_MODEL", "")


def get_webstories_listing_page_model():
    """
    Get the webstories listing page model from the ``WAGTAIL_WEBSTORIES_EDITOR_LISTING_PAGE_MODEL`` setting.
    Defaults to None if no model is defined.
    """

    from django.apps import apps

    model_string = get_webstories_editor_listing_page_model_string()

    if not model_string:
        return None

    try:
        return apps.get_model(model_string, require_ready=False)
    except ValueError:
        return None
    except LookupError:
        raise ImproperlyConfigured(
            "WAGTAIL_WEBSTORIES_EDITOR_LISTING_PAGE_MODEL refers to model '%s' that has not been installed"
            % model_string
        )
