import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { api } from '@/lib/api'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, HeadContent, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/categories/')({
    head: () => ({ meta:[{ title: "Categories | Fluxxy" }] }),
    component: RouteComponent,
})

function RouteComponent() {
    const { data, error, isLoading } = useQuery({ queryKey: ['categories'], queryFn: api.getCategories })
    const [ showAll, setShowAll ] = useState<boolean>(false)
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
                    <div className='flex justify-between items-center my-4'>
                        <h1 className='text-3xl bold'>Categories</h1>
                        <Label><Switch checked={showAll} onCheckedChange={() => setShowAll(!showAll)} /> Show empty</Label>
                    </div>
                    <div className='flex justify-center mb-4'><CreateDrawer /></div>
                    <div className='flex flex-col gap-2'>
                        {!showAll ? 
                            data?.filter((cat:any) => cat.feed_count > 0).map((cat:any) => { return (<CategoryCard key={cat.id} category={cat} />) }) :
                            data?.map((cat:any) => {return (<CategoryCard key={cat.id} category={cat} />)})
                        }
                    </div>
                </div>
            </main>
        </>
    )
}

const CreateDrawer = () => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const createMutation = useMutation({
        mutationKey: ['categories'],
        mutationFn: (values: any) => api.createCtagory(values),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
    })
    const handleSubmit = (e: any) => {
        const formValues = Object.fromEntries(e)
        Object.keys(formValues).forEach((key: any) => {
            if (formValues[key] === 'on') {
                formValues[key] = true
            } else if (formValues[key] === 'off') {
                formValues[key] = false
            }
        })
        createMutation.mutate(formValues)
        // console.log(formValues)
        setOpen(false)
    }
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild><Button variant='secondary' onClick={() => setOpen(true)}>Create Category</Button></DrawerTrigger>
            <DrawerContent className='h-[40%] lg:h-[400px]'>
                <VisuallyHidden>
                    <DrawerDescription>create category modal</DrawerDescription>
                </VisuallyHidden>
                <div className='container'>
                    <DrawerTitle className='text-center text-2xl my-4'>Create category</DrawerTitle>
                    <form className='flex flex-col gap-4' action={(e) => handleSubmit(e)}>
                        <Input name='title' placeholder='Category title' required />
                        <div className='flex items-center gap-3'>
                            <Checkbox id='hide-globally' name='hide_globally'/>
                            <Label htmlFor='hide-globally'>Hide globally</Label>
                        </div>
                        <Button variant='secondary' type='submit'>Create</Button>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

const CategoryCard = ({ category }:any) => {
    return (
        <Card onClick={() => console.log(category)}>
            <CardHeader>
                <CardTitle className='text-xl'><Link to='/categories/$id' params={{ id: category.id }}>{category.title}</Link></CardTitle>
            </CardHeader>
            <CardContent className='flex justify-between'>
                <span className='block'>Feeds: {category.feed_count}</span>
                <span className='block'>Unread entries: {category.total_unread}</span>
            </CardContent>
        </Card>
    )
}
