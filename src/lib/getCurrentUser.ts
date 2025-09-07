export default function getCurrentUser() {
    const data = fetch(`${import.meta.env.VITE_API_ENTRY}/me`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': import.meta.env.VITE_API_KEY
        }
    }).then(res => res.json)
    return data
}