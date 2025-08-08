"use client";

import { useEffect, useState } from "react";
import { Task } from "@/lib/types";
import TaskForm from "@/components/task/TaskForm";
import { generateMockTasks } from "@/lib/mockTasks";
import TaskBoard from "@/components/TaskBoard";
import { generateNextRecurringTask } from "@/lib/recurrence";
import TaskSummaryAnalytics from "@/components/task/TaskSummaryAnalytics";
import WeeklyTrendsChart from "@/components/task/WeeklyTrendsChart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const isDev = process.env.NODE_ENV !== "production";

const mockUser = {
  id: "mock-user-id",
  fullName: "Mock User",
  username: "mockuser",
  email: "mock@example.com",
  password: "",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    if (isDev) {
      setTasks(generateMockTasks(20));
    }
  }, []);

  useEffect(() => {
    const updatedTasks = [...tasks];

    tasks.forEach((task) => {
      const nextRecurring = generateNextRecurringTask(task);
      if (nextRecurring) {
        updatedTasks.push(nextRecurring);
      }
    });

    if (updatedTasks.length !== tasks.length) {
      setTasks(updatedTasks);
    }
  }, [tasks]);

  const onAddTask = (taskData: Partial<Task>) => {
    if (taskToEdit) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskToEdit.id
            ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
            : task
        )
      );
      setTaskToEdit(null);
    } else {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: taskData.status === "completed",
        deleted: false,
        userId: mockUser.id,
        user: mockUser,
      } as Task;
      setTasks((prev) => [newTask, ...prev]);
    }
    setShowForm(false);
  };

  const onDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const onToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-blue-600">📋 To-Do List App</h1>
        <p className="text-gray-500">Organize your chaos. One task at a time.</p>
      </header>

      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => {
            setTaskToEdit(null);
            setShowForm(true);
          }}
          variant={"outline"}
          className="shadow cursor-pointer"
        >
          <Plus />Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar (sticky on scroll) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="sticky top-4">
            <TaskSummaryAnalytics tasks={tasks} />
          </div>
        </div>

        {/* Task Board */}
        <div className="lg:col-span-2">
          <TaskBoard
            tasks={tasks}
            onEditTask={(task) => {
              setTaskToEdit(task);
              setShowForm(true);
            }}
            onDeleteTask={onDeleteTask}
            onToggleComplete={onToggleComplete}
            setTasks={setTasks}
          />
          <WeeklyTrendsChart tasks={tasks} />
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <TaskForm
          setShowForm={setShowForm}
          onAddTask={onAddTask}
          initialTask={taskToEdit || undefined}
        />
      )}
    </div>
  );
}
