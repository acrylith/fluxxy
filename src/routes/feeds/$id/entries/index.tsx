import Entries from '@/components/Entries'
import { api } from '@/lib/api'
import useParamStore from '@/store/useParamStore'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feeds/$id/entries/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { page, resetParams, ...searchParams } = useParamStore()
    if(page !== `feeds/${id}/entries`) {
        resetParams(`feeds/${id}/entries`)
    }
    const { isPending, error, data } = useQuery({
        queryKey:[`feeds/${id}/entries`, searchParams],
        queryFn: () => api.feeds.getEntries({id, ...searchParams}),
        select: (data) => {
            return {
                ...data,
                pagesTotal: Math.ceil(data.total/20)
            }
        },
        placeholderData: keepPreviousData,
        enabled: page === `feeds/${id}/entries`
    })
        if(isPending) return <div>Loading...</div>
        if(error) return <div className='prose prose-slate'>
            <h1>{error.name}</h1>
            <p>{error.message}</p>
        </div>
    return(
        <main>
            <Entries data={data} />
        </main>
    )
}
