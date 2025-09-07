export default function getIcon(id:Number) {
    const data = fetch(`${import.meta.env.VITE_API_ENTRY}/feeds/${id}/icon`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': import.meta.env.VITE_API_KEY
        }
    }).then(res => res.json())
    return data
}