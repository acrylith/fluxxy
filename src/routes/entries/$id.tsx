import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/entries/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const {isPending, error, data} = useQuery({
        queryKey: ['entry'],
        queryFn: () => api.getEntry(id)
    })
    if (isPending) return <div>Loading...</div>
    if (error) return <div className='prose'>
        <h1>{error.name}</h1>
        <p>{error.message}</p>
    </div>
    const gallery = data.enclosures.filter((encl: any) => encl.mime_type === 'image/*')
    console.log(gallery)
    return (
        <main className='container'>
            <article className='prose-base prose-slate'>
                <h1>{data.title}</h1>
                <div className='flex justify-between items-center-safe gap-6 text-slate-400'>
                    <div>{data.feed.title}{data.author ? <><br/><span className='italic'>{data.author}</span></> : ''}</div>
                    <div>{data.published_at}</div>
                </div>
                <div dangerouslySetInnerHTML={{__html: data.content}}/>
                <div className='flex flex-col gap-2'>
                    {gallery.map((encl: any) => (
                        <img key={encl.id} src={encl.url} />
                    ))}
                </div>
            </article>
        </main>
    )
}
