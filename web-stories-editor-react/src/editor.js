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
import {render} from '@googleforcreators/react';
import styled from 'styled-components';
import {DATA_VERSION} from '@googleforcreators/migration';

/**
 * Internal dependencies
 */
import registerServiceWorker from './serviceWorkerRegistration';
import CreationTool from './components/creationTool';
import {StoryStatusProvider, useStoryStatus} from './app/storyStatus';
import useIndexedDBMedia from './app/IndexedDBMedia/useIndexedDBMedia';


const AppContainer = styled.div`
  height:100%
`;

const Editor = (props) => {
    return (
        <AppContainer>
            <CreationTool {...props} />
        </AppContainer>
    );
};

const App = (props) => {
    useIndexedDBMedia();
    const {isInitializingIndexDB, isRefreshingMedia} = useStoryStatus(
        ({state}) => ({
            isInitializingIndexDB: state.isInitializingIndexDB,
            isRefreshingMedia: state.isRefreshingMedia,
        })
    );
    return !isInitializingIndexDB && !isRefreshingMedia ? (
        <Editor {...props}/>
    ) : (
        <p>{'Please wait'}</p>
    );
};

export function initEditor(elementId, options = {}) {

    // register service worker
    registerServiceWorker(serviceWorkerScriptUrl);

    // render
    render(
        <StoryStatusProvider>
            <App {...options}/>
        </StoryStatusProvider>,
        document.getElementById(elementId)
    );
}

const defaultPermalinkTemplate = 'https://example.org/web-stories/%pagename%/'

export function getStorySaveData(story, permalinkTemplate = defaultPermalinkTemplate) {
    const {
        pages,
        fonts,
        autoAdvance,
        featuredMedia,
        globalStoryStyles,
        defaultPageDuration,
        currentStoryStyles,
        backgroundAudio,
        storyId,
        title,
        excerpt,
        content,
        ...rest
    } = story

    return {
        storyId,
        title: {
            raw: title,
        },
        excerpt: {
            raw: excerpt,
        },
        storyData: {
            version: DATA_VERSION,
            pages,
            fonts,
            autoAdvance,
            defaultPageDuration,
            currentStoryStyles,
            backgroundAudio,
        },
        stylePresets: globalStoryStyles,
        content: content,
        capabilities: {},
        featuredMedia: {
            id: 0,
            height: 0,
            width: 0,
            url: '',
            needsProxy: false,
            isExternal: false,
        },
        author: {
            id: 1,
            name: '',
        },
        permalinkTemplate: permalinkTemplate,
        ...rest
    };
}



