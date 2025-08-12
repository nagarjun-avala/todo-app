
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AnimatePresence, motion } from 'framer-motion';
import { Task } from "@prisma/client";

interface Props {
    tasks: Task[];
    selectedDate: Date | undefined
    setSelectedDate: (date: Date | undefined) => void;

}


export default function TaskCalendar({ tasks, selectedDate, setSelectedDate }: Props) {

    const modifierColors = {
        completed: "bg-green-200/40 dark:bg-green-800/50",
        partial: "bg-yellow-200/40 dark:bg-yellow-800/50",
        notCompleted: "bg-blue-200/40 dark:bg-blue-800/50",
    };

    return (
        <div className="space-y-4">

            <AnimatePresence initial={false}>
                <motion.div
                    key="calendar"
                    initial={{ height: 0, opacity: 0, y: -8 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <Calendar
                        className="w-full border rounded-sm"
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            setSelectedDate(date);
                        }}
                        modifiers={{
                            completed: (date) =>
                                tasks.some(
                                    (task) =>
                                        task.dueDate &&
                                        format(new Date(task.dueDate), "yyyy-MM-dd") ===
                                        format(date, "yyyy-MM-dd") &&
                                        task.status === "completed"
                                ),
                            partial: (date) => {
                                const dayTasks = tasks.filter(
                                    (task) =>
                                        task.dueDate &&
                                        format(new Date(task.dueDate), "yyyy-MM-dd") ===
                                        format(date, "yyyy-MM-dd")
                                );
                                return dayTasks.length > 0 && dayTasks.some((t) => t.status !== "completed");
                            },
                            notCompleted: (date) =>
                                tasks.some(
                                    (task) =>
                                        task.dueDate &&
                                        format(new Date(task.dueDate), "yyyy-MM-dd") ===
                                        format(date, "yyyy-MM-dd") &&
                                        task.status !== "completed"
                                ),
                        }}
                        modifiersClassNames={{
                            completed: modifierColors.completed,
                            partial: modifierColors.partial,
                            notCompleted: modifierColors.notCompleted,
                        }}

                    />
                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-2 my-3 mx-2 text-sm">
                        <div className="flex items-center gap-1">
                            <span className={`w-3 h-3 rounded-sm ${modifierColors.completed}`} />
                            Done
                        </div>
                        <div className="flex items-center gap-1">
                            <span className={`w-3 h-3 rounded-sm ${modifierColors.partial}`} />
                            Partially done
                        </div>
                        <div className="flex items-center gap-1">
                            <span className={`w-3 h-3 rounded-sm ${modifierColors.notCompleted}`} />
                            Pending
                        </div>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
}
