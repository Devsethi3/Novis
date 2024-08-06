"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { LuLoader } from "react-icons/lu";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        console.log(authenticated);
      } else {
        setAuthenticated(false);
        router.push("/auth/login"); // Redirect to login page if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  if (loading) {
    return <LuLoader className="animate-spin w-5 h-5" />; // Show a loading spinner while checking authentication status
  }

  if (!authenticated) {
    return null; // or you can return a message or redirect, depending on your use case
  }

  return (
    <>
      <div>DashboardPage</div>
    </>
  );
};

export default DashboardPage;
