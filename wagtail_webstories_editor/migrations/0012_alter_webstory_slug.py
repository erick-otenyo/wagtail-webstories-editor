# Generated by Django 4.2.6 on 2023-10-23 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wagtail_webstories_editor', '0011_remove_webstoriespublisherlogo_slug_webstory_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webstory',
            name='slug',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]