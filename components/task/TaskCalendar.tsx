import { Task } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from "lucide-react";

interface Props {
    tasks: Task[];
    onDateSelect?: (date: Date | undefined) => void; // ✅ Added
}


export default function TaskCalendar({ tasks, onDateSelect }: Props) {
    const [showCalendar, setShowCalendar] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const modifierColors = {
        completed: "bg-green-200/40 dark:bg-green-800/50",
        partial: "bg-yellow-200/40 dark:bg-yellow-800/50",
        notCompleted: "bg-blue-200/40 dark:bg-blue-800/50",
    };

    return (
        <div className="space-y-4">
            <motion.button
                onClick={() => setShowCalendar((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-medium hover:underline"
                initial={false}
                transition={{ duration: 0.25 }}
            >
                <motion.div
                    animate={{ rotate: showCalendar ? 90 : 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        duration: 0.35, // matches calendar open speed
                    }}
                >
                    <ChevronRight size={16} />
                </motion.div>
                {showCalendar ? "Hide Calendar" : "Show Calendar"}
            </motion.button>
            <AnimatePresence initial={false}>
                {showCalendar && (
                    <motion.div
                        key="calendar"
                        initial={{ height: 0, opacity: 0, y: -8 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <Calendar
                            className="w-full border rounded-sm"
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                onDateSelect?.(date); //
                            }}
                            modifiers={{
                                completed: (date) =>
                                    tasks.some(
                                        (task) =>
                                            task.dueDate &&
                                            format(new Date(task.dueDate), "yyyy-MM-dd") ===
                                            format(date, "yyyy-MM-dd") &&
                                            task.completed
                                    ),
                                partial: (date) => {
                                    const dayTasks = tasks.filter(
                                        (task) =>
                                            task.dueDate &&
                                            format(new Date(task.dueDate), "yyyy-MM-dd") ===
                                            format(date, "yyyy-MM-dd")
                                    );
                                    return dayTasks.length > 0 && dayTasks.some((t) => !t.completed);
                                },
                                notCompleted: (date) =>
                                    tasks.some(
                                        (task) =>
                                            task.dueDate &&
                                            format(new Date(task.dueDate), "yyyy-MM-dd") ===
                                            format(date, "yyyy-MM-dd") &&
                                            !task.completed
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
                )}
            </AnimatePresence>
        </div>
    );
}
