import React from "react";
import Sidebar from "../_components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        {/* <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="block md:hidden">
          <MobileSidebar />
        </div> */}
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
