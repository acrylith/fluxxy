import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, HeadContent, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/')({
    head: () => ({ meta:[{ title: "Categories | Fluxxy" }] }),
    component: RouteComponent,
})

function RouteComponent() {
    const { data, error, isLoading } = useQuery({ queryKey: ['categories'], queryFn: api.getCategories })
    if (isLoading) return <div>Loading...</div>
    if (error) return <div className='prose prose-slate'>
        <h1>{error.name}</h1>
        <p>{error.message}</p>
    </div>
    return (
        <>
            <HeadContent />
            <main>
                <div className='container'>
                    <div className='flex flex-col gap-1.5'>
                        {data?.map((cat:any) => {
                            if (cat.feed_count > 0) return (
                                <Card key={cat.id}>
                                    <CardHeader>
                                        <CardTitle className='text-xl'><Link to='/categories/$id' params={{ id: cat.id }}>{cat.title}</Link></CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex justify-between'>
                                        <span className='block'>Feeds: {cat.feed_count}</span>
                                        <span className='block'>Unread entries: {cat.total_unread}</span>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </main>
        </>
    )
}
