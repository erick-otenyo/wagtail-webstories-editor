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
import {useMemo} from "@googleforcreators/react";
import {StoryEditor} from "@googleforcreators/story-editor";
import {elementTypes} from "@googleforcreators/element-library";
import {registerElementType} from "@googleforcreators/elements";
import {v4 as uuidv4} from "uuid";

/**
 * Internal dependencies
 */
import {getFonts} from "../api/editor";
import Layout from "./layout";
import MediaUpload from "./MediaUpload";
import UpdateHandler from "./updateHandler";

const CreationTool = (props) => {
    const {
        editorConfig,
        initialEdits,
        storyId,
    } = props

    const {
        apiCallbacks = {},
        ...rest
    } = editorConfig || {}

    const config = useMemo(() => {
        return {
            ...rest,
            storyId: storyId ? storyId : uuidv4(),
            capabilities: {
                hasUploadMediaAction: true,
            },
            apiCallbacks: {
                ...apiCallbacks,
                updateCurrentUser: () => Promise.resolve({}),
                getFonts,
            },
            MediaUpload,
        };
    }, [storyId]);

    elementTypes.forEach(registerElementType);

    const story = initialEdits && initialEdits.story ? initialEdits.story : {}

    return (
        <StoryEditor config={config} initialEdits={{story}}>
            <Layout/>
            <UpdateHandler/>
        </StoryEditor>
    );
};

export default CreationTool;
