import Entries from '@/components/Entries'
import { api } from '@/lib/api'
import useParamStore from '@/store/useParamStore'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { page, resetParams, ...searchParams } = useParamStore()
    if (page !== `categories/${id}`) {
        resetParams(`categories/${id}`)
    }
    const { isPending, error, data } = useQuery({
        queryKey: [`categories/${id}`, searchParams],
        queryFn: () => api.getCategoryEntries({id, ...searchParams}),
        select: (data) => {
            return {
                ...data,
                pagesTotal: Math.ceil(data.total / 20)
            }
        },
        placeholderData: keepPreviousData,
        enabled: page === `categories/${id}`
    })

    if(isPending) return <div>Loading...</div>
    if(error) return <div className='prose prose-slate'>
        <h1>{error.name}</h1>
        <p>{error.message}</p>
    </div>
    return (
        <Entries data={data} />
    )
}
