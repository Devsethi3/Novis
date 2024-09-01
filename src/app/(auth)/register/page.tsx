"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signInWithGoogle, signUp } from "@/lib/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";
import { LucideGithub, LucideLoader, Mountain } from "lucide-react";
import Image from "next/image";

const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormValues = z.infer<typeof FormSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await signUp(data.email, data.password, data.name);
      toast.success("Account Created Successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      if (error.message === "Email already exists.") {
        toast.error("Account already exists. Please log in.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
      toast.success("Account Created Successfully!");
    } catch (error) {
      toast.error("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 lg:py-8 py-4">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-lg lg:shadow-lg shadow-none lg:border sm:border-none lg:p-8 p-4">
        <h2 className="text-3xl flex items-center gap-6 flex-col font-bold text-center mb-8">
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
          Register your account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm opacity-75">
              Name
            </Label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
              />
            </div>
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm opacity-75">
              Email
            </Label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm opacity-75">
              Password
            </Label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`pl-10 pr-10 ${
                  errors.password ? "border-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <LucideLoader className="w-4 h-4 animate-spin mr-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" /*onClick={() => signIn("github")}*/>
            <LucideGithub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" onClick={handleGoogleSignIn}>
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
            prefetch={false}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
