import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getInitials } from '@/lib/utils'
import { User } from '@prisma/client'
import { LogOut, Sparkles } from 'lucide-react'
import { logout } from '@/utils/controller'

type Props = {
    user: User | null
}

const HeaderUser = ({ user }: Props) => {
    return (
        <div className="text-sm text-gray-600 dark:text-gray-300">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src={user?.avatar ?? undefined} alt={user?.fullName} />
                        <AvatarFallback className="rounded-lg">{getInitials(user?.fullName)}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mt-1"
                    side={"bottom"}
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user?.avatar ?? undefined} alt={user?.fullName} />
                                <AvatarFallback className="rounded-lg">{getInitials(user?.fullName)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.fullName}</span>
                                <span className="truncate text-xs">{user?.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem disabled>
                            <Sparkles />
                            Upgrade to Pro - Upcoming
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='cursor-pointer'
                        onClick={() => logout()}
                    >
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default HeaderUser