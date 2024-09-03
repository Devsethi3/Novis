"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SiPowerpages } from "react-icons/si";

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-6">
      <div className="mb-6">
        <SiPowerpages size={150} className="text-primary mx-auto" />
      </div>
      <h1 className="text-5xl font-extrabold text-primary mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button
        variant="secondary"
        className="px-6 py-3 rounded-md text-white bg-primary hover:bg-primary-dark transition duration-300"
        onClick={handleGoHome}
      >
        Go Back Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
