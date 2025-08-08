import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarCheck2, Repeat, ClipboardList, AlarmClock } from "lucide-react";
import { JSX } from "react";
import { Card } from "../ui/card";

interface Props {
    tasks: Task[];
}

export default function TaskSummaryAnalytics({ tasks }: Props) {

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const recurring = tasks.filter((t) => t.recurrence && t.recurrence !== "none").length;
    const overdue = tasks.filter(
        (t) => t.dueDate && !t.completed && new Date(t.dueDate) < new Date()
    ).length;

    const summaryCard = (
        icon: JSX.Element,
        label: string,
        value: number,
        bgColor: string,
    ) => (
        <Card
            className={cn("flex flex-row items-center justify-between gap-3 py-2 px-3 rounded shadow-sm border-none text-gray-700 dark:text-gray-200", bgColor)}
        >
            <div className="flex flex-row gap-2 items-center">
                {icon}
                <p className="text-sm">{label}</p>
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
                {value}
            </p>
        </Card>
    );

    return (
        <section className="grid grid-cols-1 gap-2" >
            {
                summaryCard(
                    <ClipboardList size={20} />,
                    "Total Tasks",
                    total,
                    "bg-gray-50 dark:bg-gray-800",
                )
            }
            {
                summaryCard(
                    <AlarmClock size={20} />,
                    "Overdue",
                    overdue,
                    "bg-red-50 dark:bg-red-900/30",
                )
            }
            {
                summaryCard(
                    <Repeat size={20} />,
                    "Recurring Tasks",
                    recurring,
                    "bg-purple-50 dark:bg-purple-900/30",
                )
            }
            {
                summaryCard(
                    <CalendarCheck2 size={20} />,
                    "Completed",
                    completed,
                    "bg-green-50 dark:bg-green-900/30",
                )
            }
        </section >
    );
}
