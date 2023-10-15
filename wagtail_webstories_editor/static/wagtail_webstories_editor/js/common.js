const getImages = (apiImagesUrl) => fetch(apiImagesUrl).then(res => res.json()).then(res => {
    return {
        items: res.items.map(image => ({
            id: image.id,
            src: image.meta.download_url,
            type: "image",
            mimeType: image.meta.mime_type,
            sizes: {},
            width: image.meta.size.width,
            height: image.meta.size.height,
        })),
        meta: {totalItems: res.meta.total_count, totalPages: 1}
    }
});

const getVideos = (apiMediaUrl) => fetch(apiMediaUrl + "?type=video").then(res => res.json()).then(res => {
    return {
        items: res.items.map(video => ({
            id: video.id,
            src: video.meta.download_url,
            type: "video",
            mimeType: video.meta.mime_type,
            sizes: {},
            width: 100,
            height: 100,
        })),
        meta: {totalItems: res.meta.total_count, totalPages: 1}
    }
});