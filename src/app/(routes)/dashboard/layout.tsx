import React from "react";
import Sidebar from "../_components/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
