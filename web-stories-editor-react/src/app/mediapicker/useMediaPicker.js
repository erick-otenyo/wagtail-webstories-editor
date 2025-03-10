/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import {useCallback} from '@googleforcreators/react';
import {useConfig} from '@googleforcreators/story-editor';
import {getVideoLength, hasVideoGotAudio, preloadVideo, seekVideo} from '@googleforcreators/media';


function showVideoModal(onSelect) {
    window.ModalWorkflow({
        url: window.mediaVideoChooserUrl,
        onload: MEDIA_CHOOSER_MODAL_ONLOAD_HANDLERS,
        responses: {
            mediaChosen: async function (videoData) {
                const {id} = videoData

                const videoSrc = window.wagtailMediaApiUrl.replace(/\/$/, "") + `/${id}`

                const media = await fetch(videoSrc).then(res => res.json()).then(media => {
                    return {
                        mimeType: media.meta.mime_type,
                        url: media.meta.download_url,
                        title: media.title,
                        id: media.id
                    }
                })

                const videoResource = {
                    id: media.id,
                    src: media.url,
                    type: "video",
                    mimeType: media.mimeType,
                    sizes: {},
                }

                const video = await preloadVideo(media.url);
                await seekVideo(video);

                videoResource.width = video.videoWidth;
                videoResource.height = video.videoHeight;
                const videoLength = getVideoLength(video);

                videoResource.length = videoLength.length;
                videoResource.lengthFormatted = videoLength.lengthFormatted;
                videoResource.isMuted = !hasVideoGotAudio(video);


                onSelect(videoResource)
            }
        }
    });
}

function showAudioModal(onSelect) {
    window.ModalWorkflow({
        url: window.mediaAudioChooserUrl,
        onload: MEDIA_CHOOSER_MODAL_ONLOAD_HANDLERS,
        responses: {
            mediaChosen: async function (audioData) {
                const {id} = audioData

                const audioSrc = window.wagtailMediaApiUrl.replace(/\/$/, "") + `/${id}`

                const media = await fetch(audioSrc).then(res => res.json()).then(media => {
                    return {
                        mimeType: media.meta.mime_type,
                        url: media.meta.download_url,
                        title: media.title,
                        id: media.id
                    }
                })

                const audioResource = {
                    id: media.id,
                    src: media.url,
                    type: "audio",
                    mimeType: media.mimeType,
                    sizes: {},
                    height: 0,
                    width: 0
                }

                onSelect(audioResource)
            }
        }
    });
}

function showCaptionModal(onSelect) {
    const documentModal = new window.DocumentChooserModal(window.documentChooserUrl)
    documentModal.open({}, async (documentData) => {
        const {id} = documentData
        const docSrc = window.wagtailDocumentApiUrl.replace(/\/$/, "") + `/${id}`
        const file = await fetch(docSrc).then(res => res.json()).then(doc => {
            return {
                mimeType: doc.meta.mime_type,
                url: doc.meta.download_url,
                title: doc.title,
                id: doc.id
            }
        })

        const captionResource = {
            id: file.id,
            src: file.url,
            type: "caption",
            mimeType: file.mimeType,
            sizes: {},
            height: 0,
            width: 0
        }

        onSelect(captionResource)
    })
}

function showImageModal(onSelect) {
    const imageModal = new window.ImageChooserModal(window.imageChooserUrl)
    imageModal.open({}, async (imageData) => {
        const {id} = imageData
        const imageSrc = window.wagtailImageApiUrl.replace(/\/$/, "") + `/${id}`

        const image = await fetch(imageSrc).then(res => res.json()).then(img => {
            return {
                mimeType: img.meta.mime_type,
                url: img.meta.download_url,
                title: img.title,
                width: img.meta.size.width,
                height: img.meta.size.height,
                id: img.id,

            }
        })

        const imageResource = {
            id: image.id,
            type: "image",
            mimeType: image.mimeType,
            src: image.url,
            width: image.width,
            height: image.height,
            alt: image.title,
            sizes: {},
        }

        onSelect(imageResource);
    })
}

function useMediaPicker({onSelect, onClose, multiple = false}) {

    const {
        capabilities: {hasUploadMediaAction},
    } = useConfig();

    return useCallback(
        async (evt, resourceType) => {


            // If a user does not have the rights to upload to the media library, do not show the media picker.
            if (!hasUploadMediaAction) {
                evt.preventDefault();
                return;
            }

            switch (resourceType) {
                case "video":
                    showVideoModal(onSelect)
                    break
                case "audio":
                    showAudioModal(onSelect)
                    break
                case "caption":
                    showCaptionModal(onSelect)
                    break
                default:
                    showImageModal(onSelect)
            }
        },
        [
            hasUploadMediaAction,
            multiple,
            onClose,
            onSelect,
        ]
    )
}

export default useMediaPicker;
