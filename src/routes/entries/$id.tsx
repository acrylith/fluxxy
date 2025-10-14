import Enclosures from '@/components/Enclosures'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import dayjs from 'dayjs'

export const Route = createFileRoute('/entries/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const router = useRouter()
    // console.log(router)
    const { id } = Route.useParams()
    const {isPending, error, data} = useQuery({
        queryKey: [`entry/${id}`],
        queryFn: () => api.getEntry(id)
    })
    if (isPending) return <div>Loading...</div>
    if (error) return <div className='prose'>
        <h1>{error.name}</h1>
        <p>{error.message}</p>
    </div>
    // const gallery = data.enclosures.filter((encl: any) => encl.mime_type.includes('image'))
    return (
        <main className='container mb-10'>
            <article className='prose-base prose-slate mt-4'>
                <h2>{data.title}</h2>
                <div className='flex justify-between mb-4'>
                    <button onClick={() => router.history.back()}>go Back</button>
                    <a href={data.url} target='_blank' className='underline text-cyan-700'>Read on website...</a>
                </div>
                <div className='flex justify-between items-start gap-6 text-slate-400 text-sm'>
                    <div>{data.feed.title}{data.author ? <><br/><span className='italic'>{data.author}</span></> : ''}</div>
                    {/* <div className='w-fit'>{publishDate.format('DD/MM/YY HH:mm')}</div> */}
                    <div className='min-w-max'>{dayjs(data.published_at).format('DD/MM/YY HH:mm')}</div>
                </div>
                <div dangerouslySetInnerHTML={{__html: data.content}}/>
                <div className='flex flex-col gap-2'>
                    {/* {gallery.map((encl: any) => (
                        <img key={encl.id} src={encl.url} />
                    ))} */}
                    <Enclosures enclosures={data.enclosures} />
                </div>
            </article>
        </main>
    )
}
