import { useQuery } from '@tanstack/react-query'
import { createFileRoute, HeadContent, Link } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/feeds/')({
    head: () => ({ meta:[{ title: "Feeds | Fluxxy" }] }),
    component: RouteComponent,
})

function RouteComponent() {
    const { data, error, isPending } = useQuery({ queryKey: ['feeds'], queryFn: api.getFeeds })
    if (isPending) return <div>Loading...</div>
    if (error) return <div>Some error occured, check console</div>
    return (
        <>
            <HeadContent />
            <main>
                <div className='container'>
                    <h2 className='text-3xl'>Feeds list</h2>
                    <div className='flex flex-col gap-1.5'>
                        {data?.map((feed:any) => {
                            return (
                                <Card key={feed.id}>
                                    <CardHeader>
                                        <CardTitle className='text-xl'><Link to='/feeds/$id' params={{ id: feed.id }}>{feed.title}</Link></CardTitle>
                                    </CardHeader>
                                    <CardContent>{feed.description}</CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </main>
        </>
    )
}