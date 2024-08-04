"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleLogout = () => {
    signOut();
    router.push("/");
  };
  const tasks = useQuery(api.tasks.get);
  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
      <div>
        <Button onClick={handleLogout}>Sign Out</Button>
      </div>
    </main>
  );
}
