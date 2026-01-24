import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, HeadContent, Link } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { Checkbox } from '@/components/ui/checkbox'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useActionState, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Feed } from '@/lib/types'
import { Pen } from 'lucide-react'

export const Route = createFileRoute('/feeds/')({
    head: () => ({ meta:[{ title: "Feeds | Fluxxy" }] }),
    component: RouteComponent,
})

function RouteComponent() {
    // const queryClient = useQueryClient()
    // const deleteMutation = useMutation({
    //     mutationKey: ['deleteFeed'],
    //     mutationFn: (params: {id:number, iconId:number}) => api.feeds.delete(params),
    //     onSuccess: async () => {
    //         queryClient.invalidateQueries({ queryKey: ['feeds'] })
    //     },
    //     onError : (error:AxiosError) => {
    //         toast.error(`${error.status} : ${error.code}`, { description: error.message })
    //     }
    // })
    const { data, error, isPending } = useQuery({ queryKey: ['feeds'], queryFn: api.feeds.getAll })
    if (isPending) return <div>Loading...</div>
    if (error) return <div>Some error occured, check console</div>
    return (
        <>
            <HeadContent />
            <main>
                <div className='container'>
                    <div className='flex justify-between items-center my-4'>
                        <h1 className='text-3xl bold'>Feeds list</h1>
                        <div>
                            <CreeateDrawer />
                        </div>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        {data?.map((feed:Feed) => {
                            return (
                                <Card key={feed.id} className='gap-4'>
                                    <CardHeader className='flex justify-between items-center'>
                                        <CardTitle className='text-xl'>
                                            <Link to='/feeds/$id/entries' params={{ id: feed.id.toString() }}>{feed.title}</Link>
                                        </CardTitle>
                                        <Button asChild variant='outline'>
                                            <Link className='underline' to='/feeds/$id' params={{ id: feed.id.toString() }}><Pen /></Link>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className='text-slate-400'>
                                        {feed.description}
                                        {/* <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant='destructive'>Delete</Button>
                                            </DialogTrigger>
                                            <DialogContent className='sm:max-w-[425px]'>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This action will delete chosen feed. Do you want to proceed?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className='flex justify-center'>
                                                    <Button variant='destructive' onClick={() => deleteMutation.mutate({ id: feed.id, iconId: feed.icon.icon_id })}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog> */}
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

const CreeateDrawer = () => {
    const [ open, setOpen ] = useState(false)
    const queryClient = useQueryClient()
    const categories = useQuery({ queryKey: ['groups'], queryFn: api.getCategories })
    // console.log(categories.data)
    const createMutation = useMutation({
        mutationKey: ['createFeed'],
        mutationFn: (values:any) => api.feeds.create(values),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['feeds'] })
            setOpen(false)
        },
        onError : (error:AxiosError) => {
            toast.error(`${error.status} : ${error.code}`, { description: error.message })
        }
    })
    // @ts-ignore
    const [ result, submitAction, isPending ] = useActionState((
        // @ts-ignore
        async (previoustState:any, formData: any) => {
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
            createMutation.mutate(cleanedData)
            // console.log(cleanedData)
            return { result: 'success', message: 'Check console' }
        }
    ), { result: '', message: '' })
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild><Button variant='secondary' className='bold text-2xl' onClick={() => setOpen(true)}>+</Button></DrawerTrigger>
            <DrawerContent className='h-[600px] flex flex-col'>
                <VisuallyHidden>
                    <DrawerDescription>create feed modal</DrawerDescription>
                </VisuallyHidden>
                <form className='flex flex-col gap-4 h-full p-4 overflow-hidden' action={submitAction}>
                    <DrawerTitle className='text-center text-2xl'>Create feed</DrawerTitle>
                    <Input name='feed_url' placeholder='Feed RSS link' required />
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
                    <Button variant='secondary' type='submit' disabled={isPending}>Create feed</Button>
                </form>
            </DrawerContent>
        </Drawer>
    )
}