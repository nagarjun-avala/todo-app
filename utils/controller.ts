import { Task } from "@prisma/client";
import { getData, postData } from "./api";

/**
 * Logs out the current user.
 *
 * Clears stored auth tokens and redirects to the homepage.
 *
 * @returns A success boolean or throws on failure
 * @throws If logout logic encounters an unexpected error
 */
export const logout = async (): Promise<boolean> => {
    try {
        // Clear tokens or session data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.clear();

        // Optionally, hit logout endpoint on backend
        await getData("/api/logout")

        // Redirect to home/login page
        window.location.href = "/";
        return true;
    } catch {
        // console.error("❌ Failed to logout:", error);
        throw new Error("Logout failed. Please try again.");
    }
};


/**
 * Registers a new user by sending their data to the registration API endpoint.
 *
 * @param user The user data (name, email, password).
 * @returns The created user object or throws an error if registration fails.
 */
export const registerUser = async (user: {
    fullName: string
    email: string
    password: string
    confirmPassword: string
}) => {
    try {
        const res = await postData("/api/register", user);
        return res;
    } catch {
        throw new Error("Failed to register user");
    }
};

/**
 * Logs in a user by sending their credentials to the login API endpoint.
 *
 * @param credentials The user's login credentials (email, password).
 * @returns The logged-in user data (or token) or throws an error if login fails.
 */
export const loginUser = async (credentials: {
    email: string;
    password: string;
}) => {
    try {
        const res = await postData("/api/login", credentials);
        return res;
    } catch {
        throw new Error("Failed to login");
    }
};


export const getTasks = async () => {
    try {
        const res = await getData("/api/task") as { success: boolean, message: string, tasks: Task[] }
        return res?.tasks as Task[]
    } catch {
        throw new Error("Falied to fetch data")
    }
}