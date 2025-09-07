export default function getFeeds() {
    const data = fetch(`${import.meta.env.VITE_API_ENTRY}/feeds`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': import.meta.env.VITE_API_KEY
        }
    }).then(res => res.json())
    return data
}