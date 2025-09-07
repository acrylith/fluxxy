import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'

export const Route = createFileRoute('/feeds')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data, error, isPending } = useQuery({ queryKey: ['feeds'], queryFn: api.getFeeds })
    if (isPending) return <div>Loading...</div>
    if (error) return <div>Some error occured, check console</div>
    return (
        <main>
            <h2 className='text-3xl'>Feeds list</h2>
            <ul className='flex flex-col gap-3'>
                {data?.map((item:any) => {
                    return (
                        <li key={item.id}>
                            <h3 className='text-xl font-semibold mb-1.5'>{item.title}</h3>
                            <p>{item.description}</p>
                        </li>
                    )
                })}
            </ul>
        </main>
    )
}
