import {useEffect} from '@googleforcreators/react';
import {useHistory, useStory} from '@googleforcreators/story-editor';

function UpdateHandler() {
    const {
        state: {hasNewChanges},
    } = useHistory();

    const {saveStory} = useStory(({actions: {saveStory},}) => ({saveStory,}));


    useEffect(() => {
        if (!hasNewChanges) {
            return undefined;
        }
        saveStory()

    }, [hasNewChanges]);


    return null
}

UpdateHandler.propTypes = {};

export default UpdateHandler;