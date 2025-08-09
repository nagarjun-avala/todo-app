"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginSchemaType, loginSchema } from "@/lib/zodSchems";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, LockOpen, Mail } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ""
    }
  });

  const handleLogin = async (data: LoginSchemaType) => {
    setLoading(true);
    try {
      console.log(data)
      // await loginUser(data); // uses postData internally
      toast.success("Logged in successfully!");
      router.push(callbackUrl); // or navigate where needed
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("w-full max-w-md shadow-md", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="flex flex-col gap-6">
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
                {errors.email && <p className="text-sm text-destructive mt-0.5">{errors?.email?.message}</p>}
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
                  />
                  <Button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 text-xs bg-transparent hover:bg-transparent cursor-pointer">
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive mt-0.5">{errors?.password?.message}</p>}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/register"} className="underline underline-offset-4">Register</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
