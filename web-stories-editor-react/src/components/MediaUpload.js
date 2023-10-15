/*
 * Copyright 2021 Google LLC
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
 * Internal dependencies
 */
import useMediaPicker from '../app/mediapicker/useMediaPicker';
import {useCallback} from "@googleforcreators/react";
import {Button, ButtonSize, ButtonType, ButtonVariant, Icons, themeHelpers} from "@googleforcreators/design-system";
import {__} from "@googleforcreators/i18n";
import styled from "styled-components";
import {array} from "prop-types";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  height: 32px;
`;

const Space = styled.div`
  width: 8px;
`;

const StyledButton = styled(Button)`
  ${({theme}) =>
    themeHelpers.focusableOutlineCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
    )};
`;

const UploadButton = styled(StyledButton)`
  padding: 12px 8px;
`;


function MediaUpload({render, type: allowedTypes, ...rest}) {
    const openResourceDialog = useMediaPicker(rest);

    const isImageOnly = Array.isArray(allowedTypes) && allowedTypes.every(t => t.startsWith("image"))

    // check if only audio files allowed
    const isAudioOnly = Array.isArray(allowedTypes) && allowedTypes.every(t => t.startsWith("audio"))

    // check if captions
    const isCaptions = Array.isArray(allowedTypes) && allowedTypes.find(t => t.startsWith("text"))


    const renderAudioUploadButton = useCallback(
        (open) => (
            <UploadButton
                onClick={(e) => open(e, "audio")}
                type={ButtonType.Secondary}
                size={ButtonSize.Small}
                variant={ButtonVariant.Rectangle}
            >
                {__('Upload an audio file', 'web-stories')}
            </UploadButton>
        ),
        []
    );

    const renderUploadCaptionButton = useCallback(
        (open) => (
            <UploadButton
                onClick={(e) => open(e, "caption")}
                type={ButtonType.Secondary}
                size={ButtonSize.Small}
                variant={ButtonVariant.Rectangle}
            >
                {__('Upload audio captions', 'web-stories')}
            </UploadButton>
        ),
        []
    );


    const renderMediaButtons = useCallback(
            (open) => (
                <Wrapper>
                    <Button
                        variant={ButtonVariant.Square}
                        type={ButtonType.Secondary}
                        size={ButtonSize.Small}
                        onClick={(e) => open(e, "image")}
                        aria-label={__('Upload Images', 'web-stories')}
                    >
                        <Icons.ArrowCloud/>
                    </Button>
                    <Space/>
                    <Button
                        variant={ButtonVariant.Square}
                        type={ButtonType.Secondary}
                        size={ButtonSize.Small}
                        onClick={(e) => open(e, "video")}
                        aria-label={__('Upload Video', 'web-stories')}
                    >
                        <Icons.Video/>
                    </Button>
                </Wrapper>
            ),
            []
        )
    ;

    if (isAudioOnly) {
        return renderAudioUploadButton(openResourceDialog);
    }

    if (isCaptions) {
        return renderUploadCaptionButton(openResourceDialog);
    }

    if (isImageOnly) {
        return render(openResourceDialog)
    }

    return renderMediaButtons(openResourceDialog);
}

export default MediaUpload;
