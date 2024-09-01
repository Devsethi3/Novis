"use client";

import { useState } from "react";
import useAuth from "@/lib/useAuth";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] rounded ${className}`}
  ></div>
);

const UserButton = () => {
  const { currentUser, handleLogout, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logOut = async () => {
    setIsLoggingOut(true);
    try {
      await handleLogout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4 p-2 rounded-lg bg-secondary/30 dark:bg-secondary/10 animate-fade-in">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-20 h-8" />
        </div>
      </div>
    );
  }

  return (
    <>
      {currentUser ? (
        <div className="flex items-center gap-4 p-2 rounded-lg bg-secondary/50 transition-colors animate-fade-in">
          <img
            src={currentUser.photoURL || "/placeholder.png"}
            alt="User Profile"
            className="rounded-full w-[60px] h-[45px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
          <div className="flex w-full items-center flex-col">
            <span className="text-sm line-clamp-1 font-semibold dark:text-primary-dark">
              {currentUser.displayName || "User"}
            </span>
            <Button
              onClick={logOut}
              className="text-xs w-full flex items-center gap-2 mt-1"
              variant="outline"
              size="sm"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <FaSignOutAlt className="h-4 w-4" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/10 dark:bg-secondary/5 p-4 rounded-lg animate-fade-in">
          😔 User not found
        </div>
      )}
    </>
  );
};

export default UserButton;
