import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, HeadContent, Link } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { Checkbox } from '@/components/ui/checkbox'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useActionState, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

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
                    <div className='flex justify-between items-center my-4'>
                        <h1 className='text-3xl bold'>Feeds list</h1>
                        <div>
                            <CreeateDrawer />
                        </div>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        {data?.map((feed:any) => {
                            return (
                                <Card key={feed.id}>
                                    <CardHeader>
                                        <CardTitle className='text-xl'><Link to='/feeds/$id/entries' params={{ id: feed.id }}>{feed.title}</Link></CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <p className='pb-2'>{feed.description}</p> */}
                                        <Link className='underline' to='/feeds/$id' params={{ id: feed.id }}>Edit</Link>
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
    const createMutation = useMutation({
        mutationKey: ['createFeed'],
        mutationFn: (values:any) => api.feed.create(values),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['feeds'] })
            setOpen(false)
        }
    })
    const [ result, submitAction, isPending ] = useActionState((
        async (previoustState:any, formData:any) => {
            const rawData = Object.fromEntries(formData)
            const cleanedData = Object.keys(rawData).reduce((acc:any, key) => {
                let value = rawData[key];
                if (value === 'on') {
                value = true;
                }
                if (value !== undefined && value !== null && value !== "") {
                acc[key] = value;
                }
                return acc;
            }, {});
            createMutation.mutate(cleanedData)
            return { result: 'success', message: 'Check console' }
        }
    ), { result: '', message: '' })
    // const handleSubmit = (e:any) => {
    //     const formValues = Object.fromEntries(e)
    //     Object.keys(formValues).forEach((key: any) => {
    //         if (formValues[key] === 'on') {
    //             formValues[key] = true
    //         } else if (formValues[key] === 'off') {
    //             formValues[key] = false
    //         }
    //     })
    //     console.log(formValues)
    //     setOpen(false)
    // }
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild><Button variant='secondary' className='bold text-2xl' onClick={() => setOpen(true)}>+</Button></DrawerTrigger>
            <DrawerContent className='h-[600px] flex flex-col'>
                <VisuallyHidden>
                    <DrawerDescription>create feed modal</DrawerDescription>
                </VisuallyHidden>
                {/* <div className="container flex-1 pb-4"> */}
                    <form className='flex flex-col gap-4 h-full p-4 overflow-hidden' action={submitAction}>
                        <DrawerTitle className='text-center text-2xl'>Create feed</DrawerTitle>
                        <Input name='feed_url' placeholder='Feed RSS link' required />
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
                {/* </div> */}
            </DrawerContent>
        </Drawer>
    )
}