import { idxDB } from "./indexeddb"
import type { FeedIcon } from "./types"

const basePath = import.meta.env.VITE_API_ENTRY
const headers = {
    'X-Auth-Token': import.meta.env.VITE_API_KEY
}
// const token = import.meta.env.VITE_API_KEY

const getIconIds = (data:any) => {
    const ids:any = []
    data?.map((entry: any) => {
        if(!ids.includes(entry.feed.icon.icon_id)) {
            ids.push(entry.feed.icon.icon_id)
        }
    })
    return ids
}

async function pushIcons(data:any) {
    // const { entries } = data
    const icons = await idxDB.icons.bulkGet(getIconIds(data.entries))
    await data.entries.forEach((element:any) => {
        const { icon_id } = element.feed.icon
        const icon = icons.find((el:FeedIcon|any) => el?.id === icon_id)
        if(icon !== null || undefined) {
            element.feed.icon.data = icon?.data
        } else {
            element.feed.icon.data = null
        }
        
    });
    // console.log(entries)
    return data
}

const api = {
    feed: {
        create: async (params:any) => {
            const data = fetch(`${basePath}/feeds`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(params)
            }).then(res => res.json())
            return data
        }
    },
    getEntries: async (params:any) => {
        const { offset, order, direction } = params
        const data = fetch(`${basePath}/entries?limit=20&offset=${offset}&order=${order}&direction=${direction}`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        .then(res => pushIcons(res))
        return data
    },
    getEntry: (id: string) => {
        const data = fetch(`${basePath}/entries/${id}`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        return data
    },
    getFeeds: () => {
        const data = fetch(`${basePath}/feeds`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        return data
    },
    getFeed: (id: string) => {
        const data = fetch(`${basePath}/feeds/${id}`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        return data
    },
    getFeedEntries: (params: any) => {
        const { id, offset, order, direction } = params
        const data = fetch(`${basePath}/feeds/${id}/entries?limit=20&offset=${offset}&order=${order}&direction=${direction}`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        .then(res => pushIcons(res))
        return data
    },
    getCategories: () => {
        const data = fetch(`${basePath}/categories?counts=true`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        return data
    },
    createCtagory: (params: any) => {
        const data = fetch(`${basePath}/categories`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(params)
        }).then(res => res.json())
        return data
    },
    getCategoryEntries: (params: any) => {
        const { id, offset, order, direction } = params
        const data = fetch(`${basePath}/categories/${id}/entries?limit=20&offset=${offset}&order=${order}&direction=${direction}`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        .then(res => pushIcons(res))
        return data
    },
    getIconByID: (id: number | string | undefined ) => {// icon query won't work without 'undefined'
        const data = fetch(`${basePath}/icons/${id}`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        return data
    },
    getIconByFeedID: (id: number | string) => {
        const data = fetch(`${basePath}/feeds/${id}/icon`, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        return data
    },
    me: () => {
        const data = fetch(`${basePath}/me`, {
        method: 'GET',
        headers: headers
        }).then(res => res.json())
        return data
    }
}

export { api }