import SideMenu from '@/components/SideMenu'
import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { title: "Fluxxy" }
        ]
    }),
    component: () => (
        <>
            <HeadContent />
            <SideMenu />
            <Outlet />
        </>
    ),
})