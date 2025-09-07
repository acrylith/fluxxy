const basePath = import.meta.env.VITE_API_ENTRY
const token = import.meta.env.VITE_API_KEY

const api = {
    getEntries: (params:any) => {
        const { offset, order, direction } = params
        const data = fetch(`${basePath}/entries?limit=20&offset=${offset}&order=${order}&direction=${direction}`, {
            method: 'GET',
            headers: {
                'X-Auth-Token': token
            }
        }).then(res => res.json())
        return data
    },
    getEntry: (id: string) => {
        const data = fetch(`${basePath}/entries/${id}`, {
            method: 'GET',
            headers: {
                'X-Auth-Token': token
            }
        }).then(res => res.json())
        return data
    },
    getFeeds: () => {
        const data = fetch(`${basePath}/feeds`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': token
        }
        }).then(res => res.json())
        return data
    },
    me: () => {
        const data = fetch(`${basePath}/me`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': token
        }
        }).then(res => res.json())
        return data
    }
}

export { api }