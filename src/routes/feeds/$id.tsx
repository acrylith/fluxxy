import Entries from '@/components/Entries'
import { api } from '@/lib/api'
import useParamStore from '@/store/useParamStore'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/feeds/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { page, resetParams, ...searchParams } = useParamStore()
    if(page !== `feeds/${id}`) {
        resetParams(`feeds/${id}`)
    }
    // console.log(page)
    const { isPending, error, data } = useQuery({
        queryKey:[`feeds/${id}`, searchParams],
        queryFn: () => api.getFeedEntries({id, ...searchParams}),
        select: (data) => {
            return {
                ...data,
                pagesTotal: Math.ceil(data.total/20)
            }
        },
        placeholderData: keepPreviousData,
        enabled: page === `feeds/${id}`
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
