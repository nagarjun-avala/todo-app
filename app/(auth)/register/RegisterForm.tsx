"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LockOpen, Mail, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { RegisterFormValues, registerSchema } from "@/lib/zodSchems";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/utils/controller";


const RegisterForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",

        }
    });

    const handleRegister = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            await registerUser(data); // uses postData internally
            toast.success("User registered successfully!");
            router.push(callbackUrl); // or navigate where needed
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong during registration");
        } finally {
            setIsLoading(true);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Register</CardTitle>
                <p className="text-sm">Access your Expense Tracker dashboard</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
                    <div className="flex flex-col gap-6">
                        {/* Name */}
                        <div className="grid gap-3">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    {...register("fullName")}
                                    className="pl-10"
                                />
                            </div>
                            {errors.fullName && <p className="text-sm text-destructive mt-1">{errors?.fullName?.message}</p>}
                        </div>
                        {/* Email */}
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    {...register("email")}
                                    className="pl-10"
                                />
                            </div>
                            {errors.email && <p className="text-sm text-destructive mt-1">{errors?.email?.message}</p>}
                        </div>
                        {/* Password */}
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                {showPassword ? <LockOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> : <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />}

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder={showPassword ? "password" : "••••••••"}
                                    className="pl-10 pr-14"
                                    required
                                />
                                <Button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 text-xs bg-transparent hover:bg-transparent cursor-pointer">
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive mt-1">{errors?.password?.message}</p>}
                        </div>
                        {/* Confirm Password */}
                        <div className="grid gap-3">
                            <Label htmlFor="cpassword">Confirm Password</Label>
                            <div className="relative">
                                {showPassword ? <LockOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> : <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />}

                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    placeholder={showConfirmPassword ? "password" : "••••••••"}
                                    className="pl-10 pr-14"
                                    required
                                />
                                <Button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 text-xs bg-transparent hover:bg-transparent cursor-pointer">
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </Button>
                            </div>
                            {
                                errors.confirmPassword &&
                                <p className="text-sm text-destructive mt-1">{errors?.confirmPassword?.message}
                                </p>
                            }
                        </div>
                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href={"/login"} className="underline underline-offset-4">Log In</Link>
                    </div>

                </form>
            </CardContent>
        </Card>
    )
}

export default RegisterForm