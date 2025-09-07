export default function getEntries(params:any) {
    const { offset, order, direction } = params
    const data = fetch(`${import.meta.env.VITE_API_ENTRY}/entries?limit=20&offset=${offset}&order=${order}&direction=${direction}`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': import.meta.env.VITE_API_KEY
        }
    }).then(res => res.json())
    return data
}