import useAppSettings from "@/store/useAppSettings"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet"
import { AlignJustify } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Link } from "@tanstack/react-router"

export default function SideMenu() {
    const { sidebarOpened, sidebarToggle } = useAppSettings()
    return (
        <header className="fixed top-0 w-full shadow-md bg-sidebar">
            {/* <button onClick={() => sidebarToggle()}>{`${sidebarOpened}`}</button> */}
            <div className="container py-2">
                <div className="flex align-middle gap-8">
                    <Sheet open={sidebarOpened} onOpenChange={sidebarToggle}>
                        <SheetTrigger>
                            {/* <Button><AlignJustify /></Button> */}
                            <AlignJustify />
                        </SheetTrigger>
                        <SheetContent side="left" className="py-12">
                            <VisuallyHidden>
                                <SheetTitle>Navigation</SheetTitle>
                                <SheetDescription>App navigation menu</SheetDescription>
                            </VisuallyHidden>
                            <nav className="flex flex-col h-full justify-between">
                                <ul className="px-4 flex flex-col gap-2">
                                    <li onClick={sidebarToggle}><Link className="py-2 block" to="/">Unread</Link></li>
                                    <li onClick={sidebarToggle}><Link className="py-2 block" to="/feeds">Feeds</Link></li>
                                    <li onClick={sidebarToggle}><Link className="py-2 block" to="/categories">Categories</Link></li>
                                </ul>
                                <ul className="px-4 flex justify-between">
                                    <li onClick={sidebarToggle}><Link className="py-2 block" to="/user">User</Link></li>
                                </ul>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <h5 className="italic">Fluxxy</h5>
                </div>
            </div>
        </header>
    )
}