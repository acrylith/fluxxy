import { idxDB } from "./indexeddb"
import axios from "axios"
import type { createFeed, FeedIcon, updateFeed } from "./types"

const basePath = import.meta.env.VITE_API_ENTRY
const headers = {
    'X-Auth-Token': import.meta.env.VITE_API_KEY
}
// const token = import.meta.env.VITE_API_KEY

const baseApi = axios.create({
    baseURL: basePath,
    timeout: 10000,
    headers: { 'X-Auth-Token': import.meta.env.VITE_API_KEY }
})

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
    feeds: {
        get: async (id: string) => {
            const data = fetch(`${basePath}/feeds/${id}`, {
                method: 'GET',
                headers: headers
            }).then(res => res.json())
            return data
        },
        getAll: async () => {
            const data = fetch(`${basePath}/feeds`, {
                method: 'GET',
                headers: headers
            }).then(res => res.json())
            return data
        },
        getEntries: async (params: any) => {
            const { id, offset, order, direction } = params
            const data = fetch(`${basePath}/feeds/${id}/entries?limit=20&offset=${offset}&order=${order}&direction=${direction}`, {
                method: 'GET',
                headers: headers
            }).then(res => res.json())
            .then(res => pushIcons(res))
            return data
        },
        refresh: async (id:number) => {
            try {
                const response = await baseApi.put(`/feeds/${id}/refresh`)
                return response
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        markAsRead: async (id:number) => {
            try {
                const response = await baseApi.put(`/feeds/${id}/mark-all-as-read`)
                return response
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        create: async (params:createFeed) => {
            try {
                // const feedData = await baseApi.post('/feeds', params, { headers: { 'Content-Type': 'application/json' } })
                const feedData = await baseApi.post('/feeds', params)
                try {
                    const iconData = await baseApi.get(`/feeds/${feedData.data.feed_id}/icon`)
                    console.log(iconData)
                    await idxDB.icons.add({
                        id: iconData.data.id,
                        data: iconData.data.data,
                        mime_type: iconData.data.mime_type
                    })
                } catch (error) {
                    console.log(error)
                }
                return feedData
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        update: async (params:{feedId:number, formData:updateFeed}) => {
            try {
                const updatedFeed = await baseApi.put(`/feeds/${params.feedId}`, params.formData)
                return updatedFeed
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        delete: async (params: {id:number, iconId:number}) => {
            const { id, iconId } = params
            try {
                const deletedFeed = await baseApi.delete(`/feeds/${id}`)
                await idxDB.icons.delete(iconId)
                return deletedFeed
            } catch (error) {
                console.log(error)
                throw error
            }
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
    // getFeeds: () => {
    //     const data = fetch(`${basePath}/feeds`, {
    //         method: 'GET',
    //         headers: headers
    //     }).then(res => res.json())
    //     return data
    // },
    // getFeed: (id: string) => {
    //     const data = fetch(`${basePath}/feeds/${id}`, {
    //         method: 'GET',
    //         headers: headers
    //     }).then(res => res.json())
    //     return data
    // },
    // getFeedEntries: (params: any) => {
    //     const { id, offset, order, direction } = params
    //     const data = fetch(`${basePath}/feeds/${id}/entries?limit=20&offset=${offset}&order=${order}&direction=${direction}`, {
    //         method: 'GET',
    //         headers: headers
    //     }).then(res => res.json())
    //     .then(res => pushIcons(res))
    //     return data
    // },
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