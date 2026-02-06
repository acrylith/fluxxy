import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { idxDB } from '@/lib/indexeddb'
import type { Feed, updateFeed } from '@/lib/types'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { CheckCheck, Newspaper, Pen, RefreshCcw, Trash } from 'lucide-react'
import { useActionState, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/feeds/$id/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { isPending, error, data } = useQuery<Feed>({ queryKey: [`feeds/${id}`], queryFn: () => api.feeds.get(id) })
    const refreshMutation = useMutation({
        mutationKey: [`refreshFeed/${id}`],
        mutationFn: async (id:number) => api.feeds.refresh(id),
        onSuccess: () => {
            toast.success('Feed updated!')
        },
        onError: (error:AxiosError) => {
            toast.error(`${error.status} : ${error.code}`, { description: error.message })
        }
    })
    const readMutation = useMutation({
        mutationKey: [`markAsRead/${id}`],
        mutationFn: async (id:number) => api.feeds.markAsRead(id),
        onSuccess: () => {
            toast.success('Feed marked as read')
        },
        onError: (error:AxiosError) => {
            toast.error(`${error.status} : ${error.code}`, { description: error.message })
        }
    })
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
        // console.log(icon.data)
        return (
                <main className='py-8'>
                    <div className='container prose-slate'>
                        <div className='flex flex-col items-center'>
                            <div className='h-32 w-32 mb-3 rounded-lg overflow-hidden'>
                                {!icon.isPending ?
                                    <img className='w-full h-full' src={`data:${icon.data.data}`} alt={`${data.title} logo`} onClick={() => cacheLogo(icon.data)} /> :
                                    <Skeleton className='w-full h-full' />
                                }
                            </div>
                            <div className='flex flex-wrap justify-evenly items-center gap-4 mb-6'>
                                <h1 className='text-4xl font-semibold text-center'>
                                    {data.title}
                                </h1>
                                <Badge asChild className='text-2xl' variant='secondary'>
                                    {/* {data.category.title} */}
                                    <Link to='/categories/$id' params={{ id: data.category.id.toString() }}>{data.category.title}</Link>
                                </Badge>
                            </div>
                            {/* <p className='text-lg text-center mb-6'>{data.description}</p> */}
                            <div className='mb-4' dangerouslySetInnerHTML={{__html: data.description}}/>
                            <div className='flex gap-4 justify-center flex-wrap'>
                                <Button asChild size='sm'>
                                    <Link to='/feeds/$id/entries' params={{ id: data.id.toString() }}>
                                        <Newspaper /> Entries
                                    </Link>
                                </Button>
                                <Button size='sm' className='bg-amber-400 hover:bg-amber-300'
                                    disabled={refreshMutation.isPending}
                                    onClick={() => refreshMutation.mutate(Number(id))}
                                >
                                    <RefreshCcw /> Refresh in background
                                </Button>
                                <EditDrawer feedId={data.id} />
                                <Button size='sm' className='bg-green-600 hover:bg-green-400' onClick={() => readMutation.mutate(Number(id))}>
                                    <CheckCheck /> Mark as read
                                </Button>
                                <DeleteDialog feedId={data.id} iconId={data.icon.icon_id} />
                            </div>
                        </div>
                    </div>
                </main>
            )
    }
    
}

const EditDrawer:React.FC<{feedId:number}> = ({ feedId }) => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const updateMutation = useMutation({
        mutationKey: [`updateFeed/${feedId}`],
        mutationFn: (params:{feedId:number, formData:updateFeed}) => api.feeds.update(params),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: [`feeds/${feedId}`] })
            setOpen(false)
        },
        onError: (error:AxiosError) => {
            toast.error(`${error.status} : ${error.code}`, { description: error.message })
        }
    })
    const categories = useQuery({ queryKey: ['categories'], queryFn: api.getCategories, enabled: open })
    // @ts-ignore
    const [ result, submitAction, isPending ] = useActionState((
        // @ts-ignore
        async (previousState:any, formData:any) => {
            const rawData = Object.fromEntries(formData)
            let cleanedData = Object.keys(rawData).reduce((acc:any, key) => {
                let value = rawData[key];
                if (value === 'on') {
                value = true;
                }
                if (value !== undefined && value !== null && value !== "") {
                acc[key] = value;
                }
                return acc;
            }, {});
            if(cleanedData.category_id) {
                cleanedData.category_id = Number(cleanedData.category_id)
            }
            if(Object.keys(cleanedData).length > 0) {
                // console.log({feedId, formData: cleanedData})
                updateMutation.mutate({feedId, formData: cleanedData})
            } else {
                toast.error('Fill needed fields')
            }
            return { result: 'success', message: 'check console' }
        }
    ), { result: '', message: '' })
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button size='sm' className='bg-sky-600 hover:bg-sky-400 text-white'>
                    <Pen /> Edit
                </Button>
            </DrawerTrigger>
            <DrawerContent className='h-[600px]'>
                <VisuallyHidden>
                    <DrawerDescription>edit feed modal</DrawerDescription>
                </VisuallyHidden>
                
                <form className='flex flex-col gap-4 h-full p-4 overflow-hidden' action={submitAction}>
                    <DrawerTitle className='text-center text-2xl mt-4'>Edit feed</DrawerTitle>
                    
                    <Select name='category_id' onValueChange={(e) => Number(e)}>
                        <SelectTrigger className='w-[240px]'>
                            <SelectValue placeholder='Group' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Leave empty for no group</SelectLabel>
                                {categories.data ? categories.data.map((cat:any) => {
                                    return (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.title}</SelectItem>
                                    )
                                }) : null}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Accordion type='single' collapsible className='h-full flex-1 overflow-hidden'>
                        <AccordionItem value='optional' className='optional h-full max-h-full'>
                            <AccordionTrigger>Optional settings</AccordionTrigger>
                            <AccordionContent asChild className='bg-slate-900 rounded-lg p-0 h-[calc(100%-52px)]'>
                                <ScrollArea className='scroll-area flex-1 h-full w-full px-4 py-2'>
                                    <h4 className='text-slate-500 mb-4'>Specify theese ssettings only if you need</h4>
                                    <div className='flex flex-col gap-4'>
                                        <Input name='title' placeholder='Feed title' />
                                        <Input name='feed_url' placeholder='Feed RSS link' />
                                        <Input name='site_url' placeholder='Website address' />
                                        <Input name='username' placeholder='Feed username' />
                                        <Input name='password' placeholder='Feed password' />
                                        <div className='flex items-center gap-3'>
                                            <Checkbox id='crawler' name='crawler'/>
                                            <Label htmlFor='crawler'>Use Crawler</Label>
                                        </div>
                                        <Input name='user_agent' placeholder='User agent for feed' />
                                        <Input name='scraper_rules' placeholder='Scraper rules' />
                                        <Input name='rewrite_rules' placeholder='Rewrite rules' />
                                        <Textarea name='blocklist_rules' placeholder='Entry blocking rules' />{/* add docs link later */}
                                        <Textarea name='keeplist_rules' placeholder='Entry allow rules' />{/* add docs link later */}
                                        <div className='flex items-center gap-3'>
                                            <Checkbox id='ignoreHttp' name='ignore_http_cache'/>
                                            <Label htmlFor='ignoreHttp'>Ignore HTTP cache</Label>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <Checkbox id='disabled' name='disabled'/>
                                            <Label htmlFor='disabled'>Disable feed</Label>
                                        </div>
                                    </div>                                        
                                </ScrollArea>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Button variant='secondary' type='submit' disabled={isPending}>Edit feed</Button>
                </form>
            </DrawerContent>
        </Drawer>
    )
}

const DeleteDialog:React.FC<{ feedId:number, iconId: number }> = ({ feedId, iconId }) => {
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationKey: ['deleteFeed'],
        mutationFn: (params:{ id:number, iconId:number }) => api.feeds.delete(params),
        onSuccess: async() => {
            queryClient.invalidateQueries({ queryKey: [`feeds/${feedId}`] })
        }
    })
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='sm' variant='destructive'>
                    <Trash /> Delete
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action will delete chosen feed. Do you want to proceed?
                    </DialogDescription>
                </DialogHeader>
                <div className='flex justify-center'>
                    <Button variant='destructive' onClick={() => deleteMutation.mutate({ id: feedId, iconId: iconId })}>
                        <Trash /> Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
