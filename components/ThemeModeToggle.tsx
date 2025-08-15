"use client"
import * as React from "react"
import { Check, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themeData = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
]

const ThemeModeToggle = () => {
    const { theme, setTheme } = useTheme()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themeData && themeData.map(data => (

                    <DropdownMenuItem key={data.value} onClick={() => setTheme(data.value)} className="flex items-center justify-between gap-2">
                        {data.label} {data.value === theme && <Check />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeModeToggle