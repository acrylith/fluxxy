import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { title: "Unread | Fluxxy" }
        ]
    }),
    component: () => (
        <>
            <HeadContent />
            <nav className='flex justify-around items-center fixed bottom-0 w-full h-10 z-100 bg-slate-950'>
                <Link to="/">Home</Link>
                <Link to="/feeds">Feeds</Link>
                <Link to="/user">User</Link>
            </nav>
            <Outlet />
        </>
    ),
})