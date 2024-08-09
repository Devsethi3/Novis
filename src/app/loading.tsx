import { LucideLoader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-screen items-center w-full justify-center">
      <LucideLoader className="h-12 w-12 animate-spin" />
    </div>
  );
};

export default Loading;
