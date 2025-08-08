import { Task } from "@/lib/types";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Props {
    tasks: Task[];
}

// Count completed tasks per day over the past 7 days
const getWeeklyData = (tasks: Task[]) => {
    const today = new Date();

    return Array.from({ length: 7 }).map((_, i) => {
        const day = subDays(today, 6 - i);
        const label = format(day, "EEE");

        const count = tasks.filter(
            (t) =>
                t.completed &&
                t.updatedAt &&
                isSameDay(parseISO(t.updatedAt), day)
        ).length;

        return { day: label, completed: count };
    });
};

export default function WeeklyTrendsChart({ tasks }: Props) {
    const data = getWeeklyData(tasks);
    return (
        <div className="mt-6 bg-white rounded shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Weekly Completion Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis allowDecimals={false} stroke="#888" />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="completed" stroke="#4F46E5" strokeWidth={2} dot={true} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
