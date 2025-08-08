import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarCheck2, Repeat, ClipboardList, AlarmClock } from "lucide-react";
import { JSX, useState } from "react";
import TaskCalendar from "./TaskCalendar";

interface Props {
    tasks: Task[];
}

export default function TaskSummaryAnalytics({ tasks }: Props) {
    const [showCalendar, setShowCalendar] = useState(true);

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
        color: string
    ) => (
        <div className={cn("flex items-center gap-3 p-4 rounded shadow-sm", color)}>
            {icon}
            <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );

    return (
        <aside className="w-full lg:w-1/3 space-y-4 sticky top-4 self-start">
            <section className="grid grid-cols-1 gap-4">
                {summaryCard(<ClipboardList size={20} />, "Total Tasks", total, "bg-gray-50")}
                {summaryCard(<AlarmClock size={20} />, "Overdue", overdue, "bg-red-50")}
                {summaryCard(<Repeat size={20} />, "Recurring Tasks", recurring, "bg-purple-50")}
                {summaryCard(<CalendarCheck2 size={20} />, "Completed", completed, "bg-green-50")}
            </section>

            <div className="mt-4">
                <button
                    onClick={() => setShowCalendar((prev) => !prev)}
                    className="text-sm text-blue-600 hover:underline mb-2"
                >
                    {showCalendar ? "Hide Calendar" : "Show Calendar"}
                </button>
                {showCalendar && <TaskCalendar tasks={tasks} />}
            </div>
        </aside>
    );
}
