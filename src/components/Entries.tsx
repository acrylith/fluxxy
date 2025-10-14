import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import EntriesPagination from '@/components/EntriesPagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import useParamStore from '@/store/useParamStore'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'

export default function Entries({ data }:any) {
    const params = useParamStore()
    return (
        <div className='container mb-4'>
            <div className='flex justify-between pb-2'>
                <Select
                    value={params.order}
                    onValueChange={(value) => {
                        params.setOrder(value)
                    }}
                >
                    <SelectTrigger className='w-[140px] h-6'>
                        <SelectValue defaultValue={params.order} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Order by</SelectLabel>
                            <SelectItem value='published_at'>Publish date</SelectItem>
                            <SelectItem value='category_title'>Category title</SelectItem>
                            <SelectItem value='id'>ID</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    value={params.direction}
                    onValueChange={(value) => {
                        params.setDirection(value)
                    }}
                >
                    <SelectTrigger className='w-[80] h-6'>
                        <SelectValue defaultValue={params.direction} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Order direction</SelectLabel>
                            <SelectItem value='desc'>desc</SelectItem>
                            <SelectItem value='asc'>asc</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex flex-col gap-2'>
                {data?.entries?.map((entry: any) => {
                    return (
                        <Card key={entry.id}>
                            <CardHeader>
                                {/* <CardTitle><a href={entry.url} target='_blank'>{entry.title}</a></CardTitle> */}
                                <CardTitle><Link to='/entries/$id' params={{ id: entry.id }}>{entry.title}</Link></CardTitle>
                                <CardDescription className='flex justify-between'>
                                    <div>
                                        {entry.feed.title}
                                    </div>
                                    <div>{dayjs(entry.published_at).format('DD/MM/YY HH:mm')}</div>
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )
                })}
            </div>
            <EntriesPagination total={data.total} pagesTotal={data.pagesTotal} />
        </div>
    )
}
