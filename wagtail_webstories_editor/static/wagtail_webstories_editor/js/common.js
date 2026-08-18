const MEDIA_PAGE_LIMIT = 20;

const getImages = async (apiImagesUrl) => {
    let offset = 0;
    let totalCount = Infinity;
    let allItems = [];

    while (offset < totalCount) {
        const res = await fetch(`${apiImagesUrl}?limit=${MEDIA_PAGE_LIMIT}&offset=${offset}`).then(r => r.json());
        totalCount = res.meta.total_count;
        allItems = allItems.concat(res.items.map(image => ({
            id: image.id,
            src: image.meta.download_url,
            type: "image",
            mimeType: image.meta.mime_type,
            sizes: {},
            width: image.meta.size.width,
            height: image.meta.size.height,
        })));
        offset += MEDIA_PAGE_LIMIT;
    }

    return {
        items: allItems,
        meta: {totalItems: totalCount, totalPages: 1}
    };
};

const getVideos = async (apiMediaUrl) => {
    let offset = 0;
    let totalCount = Infinity;
    let allItems = [];

    while (offset < totalCount) {
        const res = await fetch(`${apiMediaUrl}?type=video&limit=${MEDIA_PAGE_LIMIT}&offset=${offset}`).then(r => r.json());
        totalCount = res.meta.total_count;
        allItems = allItems.concat(res.items.map(video => ({
            id: video.id,
            src: video.meta.download_url,
            type: "video",
            mimeType: video.meta.mime_type,
            sizes: {},
            width: 100,
            height: 100,
        })));
        offset += MEDIA_PAGE_LIMIT;
    }

    return {
        items: allItems,
        meta: {totalItems: totalCount, totalPages: 1}
    };
};
