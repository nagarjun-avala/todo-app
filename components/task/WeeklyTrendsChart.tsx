
import { format, subDays, isSameDay } from "date-fns";
import { XAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import React from "react";
import { Task } from "@prisma/client";

interface Props {
    tasks: Task[];
}

const chartConfig = {
    completed: {
        label: "Completed",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

// Count completed tasks per day over the past 7 days
const getWeeklyData = (tasks: Task[]) => {
    const today = new Date();

    return Array.from({ length: 7 }).map((_, i) => {
        const day = subDays(today, 6 - i);
        const label = format(day, "EEE");

        const count = tasks.filter(
            (t) =>
                t.status === "completed" &&
                t.updatedAt &&
                isSameDay(t.updatedAt, day)
        ).length;

        return { day: label, completed: count };
    });
};

export default function WeeklyTrendsChart({ tasks }: Props) {
    const data = React.useMemo(() => getWeeklyData(tasks), [tasks])
    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Weekly Completion Trend</CardTitle>
                    <CardDescription>
                        {`Showing completed tasks for the last 7 days`}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-completed)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-completed)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent indicator="dot" />
                            }
                        />
                        <Area
                            dataKey="completed"
                            type="natural"
                            fill="url(#fillCompleted)"
                            stroke="var(--color-completed)"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
