import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { idxDB } from '@/lib/indexeddb'
import type { Feed } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feeds/$id/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { isPending, error, data } = useQuery<Feed>({ queryKey: [`feeds/${id}`], queryFn: () => api.getFeed(id) })
    const icon = useQuery({
        queryKey: [`icon/${data?.icon.icon_id}`],
        queryFn: () => api.getIconByID(data?.icon.icon_id),
        enabled: !!data
    })
    async function cacheLogo(icon: any) {
        try {
            await idxDB.icons.add({
                id: icon.id,
                data: icon.data,
                mime_type: icon.mime_type
            })
        } catch (error) {
            console.log(error)
        }
    }
    if(isPending) return <div>Loading...</div>
    if(error) return <div className='prose prose-slate'>
        <h1>{error.name}</h1>
        <p>{error.message}</p>
    </div>
    if(data) {
        console.log(icon.data)
        return (
                <main className='py-8'>
                    <div className='container prose-slate'>
                        <div className='flex flex-col items-center'>
                            <div className='h-32 w-32 mb-3'>
                                {!icon.isPending ?
                                    <img className='w-full h-full' src={`data:${icon.data.data}`} alt={`${data.title} logo`} onClick={() => cacheLogo(icon.data)} /> :
                                    <Skeleton className='w-full h-full' />
                                }
                            </div>
                            <h1 className='text-4xl font-semibold mb-6'>{data.title}</h1>
                            <p className='text-lg text-center'>{data.description}</p>
                        </div>
                    </div>
                </main>
            )
    }
    
}
