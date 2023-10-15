import mimetypes

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.fields import ReadOnlyField
from wagtail.api.v2.utils import get_full_url
from wagtail.documents.api.v2.serializers import DocumentSerializer
from wagtail.documents.api.v2.views import DocumentsAPIViewSet
from wagtail.images.api.v2.serializers import ImageSerializer
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtailmedia.api.serializers import MediaItemSerializer
from wagtailmedia.api.views import MediaAPIViewSet


class ImageDownloadUrlField(ReadOnlyField):
    """
    Serializes the "download_url" field for image items.

    Example:
    "download_url": "http://api.example.com/media/my_video.mp4"
    """

    def get_attribute(self, instance):
        return instance

    def to_representation(self, instance):
        return get_full_url(self.context["request"], instance.file.url)


class MimeTypeField(ReadOnlyField):
    """
    Serializes the "mime_type" field for image items.

    Example:
    "mime_type": "image/png"
    """

    def get_attribute(self, instance):
        return instance

    def to_representation(self, instance):
        mimetype, encoding = mimetypes.guess_type(instance.file.name)
        return mimetype


class ImageSizeField(ReadOnlyField):
    """
     Serializes the "size" field for image items.

     Example:
     "size": {width:100, height:100}
     """

    def get_attribute(self, instance):
        return instance

    def to_representation(self, instance):
        width = instance.file.width
        height = instance.file.height
        return {"width": width, "height": height}


class CustomImageSerializer(ImageSerializer):
    download_url = ImageDownloadUrlField()
    mime_type = MimeTypeField()
    size = ImageSizeField()


class CustomImagesAPIViewSet(ImagesAPIViewSet):
    base_serializer_class = CustomImageSerializer
    meta_fields = ImagesAPIViewSet.meta_fields + ["mime_type", "size"]
    listing_default_fields = ImagesAPIViewSet.listing_default_fields + [
        "mime_type", "size"
    ]
    nested_default_fields = ImagesAPIViewSet.nested_default_fields + [
        "mime_type", "size"
    ]


class CustomMediaItemSerializer(MediaItemSerializer):
    mime_type = MimeTypeField()


class CustomMediaAPIViewSet(MediaAPIViewSet):
    base_serializer_class = CustomMediaItemSerializer
    meta_fields = ImagesAPIViewSet.meta_fields + ["mime_type"]
    listing_default_fields = ImagesAPIViewSet.listing_default_fields + ["mime_type"]

    filter_backends = MediaAPIViewSet.filter_backends + [DjangoFilterBackend]
    filterset_fields = ["type"]


class CustomDocumentSerializer(DocumentSerializer):
    mime_type = MimeTypeField()


class CustomDocumentAPIViewSet(DocumentsAPIViewSet):
    base_serializer_class = CustomDocumentSerializer
    meta_fields = ImagesAPIViewSet.meta_fields + ["mime_type"]
    listing_default_fields = ImagesAPIViewSet.listing_default_fields + ["mime_type"]
