from wagtail.api.v2.router import WagtailAPIRouter

from wagtail_webstories_editor.api_viewsets import (CustomImagesAPIViewSet,
                                                    CustomMediaAPIViewSet,
                                                    CustomDocumentAPIViewSet)

api_router = WagtailAPIRouter('wagtailapi')

api_router.register_endpoint('images', CustomImagesAPIViewSet)
api_router.register_endpoint("media", CustomMediaAPIViewSet)
api_router.register_endpoint('documents', CustomDocumentAPIViewSet)
