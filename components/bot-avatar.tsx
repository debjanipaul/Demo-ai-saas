import { Avatar, AvatarImage } from "@/components/ui/avatar"
// import Image from "next/image";

export const BotAvatar = () => {
    return (
        <Avatar className="h-8 w-8">
            <AvatarImage
                src="/logo.png"
                alt="Bot Avatar"
                width="8"
                height="8"
            />
        </Avatar>
    )
}