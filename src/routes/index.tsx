import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import useParamStore from '@/store/useParamStore'
import { api } from '@/lib/api'
import Entries from '@/components/Entries'

export const Route = createFileRoute('/')({
    component: Index,
    // validateSearch: () => {
    //     return {
    //         offset: 0,
    //         order: 'published_at',
    //         direction: 'desc'
    //     }
    // }
})

const getFeedIds = (entries:any) => {
    const ids:any = []
    entries.map((entry:any) => {
        if(!ids.includes(entry.feed.id)) {
            ids.push(entry.feed.id)
        }
    })
    return ids
}

function Index() {
    const params = useParamStore()
    const {page, ...searchParams} = params
    if(params.page !== 'entries') {
        params.resetParams('entries')
    }
    const { isPending, error, data } = useQuery({
        queryKey: ['entries', searchParams],
        queryFn: () => api.getEntries(searchParams),
        select: (data) => { 
            return {
                ...data,
                pagesTotal: Math.ceil(data.total/20),
                feedIds: getFeedIds(data.entries)
            }
        },
        placeholderData: keepPreviousData,
        enabled: params.page === 'entries'
    })
    if (isPending) return <div>Loading...</div>
    if (error) return <div className='prose'>
        <h1>{error.name}</h1>
        <p>{error.message}</p>
    </div>
    return (
        <Entries data={data} />
    )
}