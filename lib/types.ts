import { Task, User } from "@prisma/client";
import { JWTPayload } from "jose";
// Authentication Types
export interface SessionPayload extends JWTPayload {
    id: string;
    email: string;
};

//  Input Types for CRUD
export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt" | "Task">;
export type UpdateUserInput = Partial<CreateUserInput>;

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt" | "User">;
export type UpdateTaskInput = Partial<CreateTaskInput>;
