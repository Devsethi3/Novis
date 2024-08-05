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
  FaUser,
} from "react-icons/fa";
import { MountainIcon } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormValues = z.infer<typeof FormSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    clearErrors,
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });

  const password = watch("password");

  const evaluatePasswordStrength = (password: string) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "Too Short";
    if (!/[A-Z]/.test(password)) return "Add Uppercase";
    if (!/[a-z]/.test(password)) return "Add Lowercase";
    if (!/[0-9]/.test(password)) return "Add Number";
    if (!/[!@#$%^&*]/.test(password)) return "Add Special Character";
    return "Strong";
  };

  const handleInputChange = async (
    fieldName: "email" | "password" | "name"
  ) => {
    await trigger(fieldName);
    if (!errors[fieldName]) {
      clearErrors(fieldName);
    }
    if (fieldName === "password") {
      setPasswordStrength(evaluatePasswordStrength(password));
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axios.post("/api/register", data);
      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "Registration failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const signInAction = async () => {
    await signIn("google", { redirectTo: "/dashboard" });
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
            Create an account
          </h2>
        </div>
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
        >
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-muted-foreground"
            >
              Display Name
            </Label>
            <div className="mt-1 relative">
              <FaUser
                size={15}
                className="absolute left-3 top-[0.8rem] text-muted-foreground"
              />
              <Input
                id="name"
                {...register("name", {
                  onChange: () => handleInputChange("name"),
                })}
                autoComplete="name"
                className={`block w-full appearance-none rounded-md border ${
                  errors.name ? "border-red-500" : "border-input"
                } bg-background pl-10 pr-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                placeholder="John Doe"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby="name-error"
              />
              {errors.name && (
                <p id="name-error" className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
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
                autoComplete="new-password"
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
            <div className="mt-2 text-sm text-muted-foreground">
              Password Strength:{" "}
              <span
                className={`font-bold ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Too Short"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                {passwordStrength}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <Checkbox id="terms" className="h-4 w-4 rounded" />
            <Label
              htmlFor="terms"
              className="ml-2 block text-sm text-muted-foreground"
            >
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms and Conditions
              </Link>
            </Label>
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
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
          <Button variant="outline">
            <LuGithub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" onClick={signInAction}>
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
            prefetch={false}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
