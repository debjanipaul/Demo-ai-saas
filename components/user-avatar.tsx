import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import Image from "next/image";

export const UserAvatar = () => {
    const { user } = useUser();

    return (
        <Avatar className="h-8 w-8">
            <AvatarImage
                src={user?.imageUrl}
                alt="User Avatar"
                width={8}
                height={8}
            />
            {/* <Image
                // src={user?.imageUrl}
                // fill
                src="./logo.png"
                alt="User Avatar"
                width="64"
                height="64"
            // className="h-8"
            /> */}
            <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
            </AvatarFallback>
        </Avatar>
    )
}