from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.models import Page
from wagtailmedia.edit_handlers import MediaChooserPanel

from wagtail_webstories_editor.models import AbstractWebStoryListPage


class HomePage(Page):
    image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name="Banner Image"
    )

    featured_media = models.ForeignKey(
        "wagtailmedia.Media",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    content_panels = Page.content_panels + [
        FieldPanel("image"),
        MediaChooserPanel("featured_media"),
    ]


class WebStoryListPage(AbstractWebStoryListPage):
    description = models.TextField(blank=True, null=True)

    content_panels = Page.content_panels + [
        FieldPanel("description")
    ]
