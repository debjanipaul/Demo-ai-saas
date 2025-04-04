"use client";
import Link from "next/link";
import Image from "next/image"
import { Montserrat, PT_Sans } from "next/font/google";

import { cn } from "@/lib/utils"
import { LayoutDashboard, MessageSquare, Settings, SquareLibrary } from "lucide-react";
import { usePathname } from "next/navigation";


const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"]
});

const ptSans = PT_Sans({
    weight: "400",
    subsets: ["latin"]
});

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-zinc-600"
    },
    {
        label: "Conversation",
        icon: MessageSquare,
        href: "/conversation",
        color: "text-zinc-600"
    },
    {
        label: "Knowledge-Repo",
        icon: SquareLibrary,
        href: "/knowledge-repository",
        color: "text-zinc-600"
    }
    // {
    //     label: "Settings",
    //     icon: Settings,
    //     href: "/settings",
    // }

]

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#f1f5f2] text-black">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-10 h-10 mr-4">
                        <Image
                            // fill
                            alt="Logo"
                            src="/logo.png"
                            width={50}
                            height={50}
                        />
                    </div>
                    <h1 className={cn("text-2xl font-bold", ptSans.className)}>
                        Optimiste AI
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className={cn("text-md group flex p-3 w-full justify-start font-semibold cursor-pointer hover:text-zinc-400 hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-zinc-600 " : "text-zinc-500")}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;