import json

from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel
from wagtail.models import DraftStateMixin, LockableMixin, RevisionMixin, WorkflowMixin


class WebStory(WorkflowMixin, DraftStateMixin, LockableMixin, RevisionMixin, models.Model):
    title = models.CharField(max_length=255, verbose_name=_("Title"))
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

    panels = [
        FieldPanel("title"),
        FieldPanel("config"),
        FieldPanel("html")
    ]

    def __str__(self):
        return self.title

    @property
    def json_config(self):
        return json.dumps(self.config)

    @property
    def revisions(self):
        return self._revisions
