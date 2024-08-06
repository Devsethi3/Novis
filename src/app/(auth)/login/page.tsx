// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LuGithub } from "react-icons/lu";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { MountainIcon } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

const FormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormValues = z.infer<typeof FormSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    clearErrors,
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });

  const handleInputChange = async (fieldName: "email" | "password") => {
    await trigger(fieldName);
    if (!errors[fieldName]) {
      clearErrors(fieldName);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // login logic
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center bg-background px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto lg:border lg:p-6 p-2 border-muted rounded-lg lg:shadow-lg shadow-none max-w-md w-full space-y-6 lg:space-y-7">
        <Link href="#" prefetch={false} className="flex justify-center">
          <MountainIcon className="h-8 w-8 text-primary" />
          <span className="sr-only">Novis</span>
        </Link>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
        </div>
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
        >
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email address
            </Label>
            <div className="mt-1 relative">
              <FaEnvelope
                size={15}
                className="absolute left-3 top-[0.8rem] text-muted-foreground"
              />
              <Input
                id="email"
                {...register("email", {
                  onChange: () => handleInputChange("email"),
                })}
                autoComplete="email"
                className={`block w-full appearance-none rounded-md border ${
                  errors.email ? "border-red-500" : "border-input"
                } bg-background pl-10 pr-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                placeholder="you@example.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              Password
            </Label>
            <div className="mt-1 relative">
              <FaLock
                size={15}
                className="absolute left-3 top-[0.8rem] text-muted-foreground"
              />
              <Input
                id="password"
                {...register("password", {
                  onChange: () => handleInputChange("password"),
                })}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`block w-full appearance-none rounded-md border ${
                  errors.password ? "border-red-500" : "border-input"
                } bg-background pl-10 pr-10 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                placeholder="Password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p id="password-error" className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me" className="h-4 w-4 rounded" />
              <Label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-muted-foreground"
              >
                Remember me
              </Label>
            </div>
            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-primary hover:underline"
                prefetch={false}
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            //  onClick={() => signIn("github")}
          >
            <LuGithub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            //  onClick={() => signIn("google")}
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
            prefetch={false}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
