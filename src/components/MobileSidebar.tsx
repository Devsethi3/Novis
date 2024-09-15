"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

const MobileSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      <div>
        <div className="fixed top-[1.25rem] left-3 z-10">
          <Button
            variant="secondary"
            size="sidebarMenu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="focus:outline-none"
          >
            <HiMenu className="h-5 w-5 opacity-80" />
          </Button>
        </div>
      </div>
      <motion.div
        className="w-screen h-screen absolute dark:bg-[#0e1613] bg-[#f5fffc] bg-opacity-95 backdrop-blur-lg z-40"
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="flex justify-between items-center p-4">
          <Button
            size="sidebarMenu"
            variant="secondary"
            onClick={() => setIsSidebarOpen(false)}
          >
            <IoClose className="h-5 w-5 opacity-80" />
          </Button>
          <h2 className="text-center text-xl font-bold">Mobile Sidebar</h2>
        </div>
        <div className="px-4 absolute bottom-0 items-center border-t dark:bg-[#0e1613] bg-[#f5fffc] bg-opacity-95 backdrop-blur-lg">
          <Button className="mb-2">Link 1</Button>
          <Button className="mb-2">Link 2</Button>
          <Button className="mb-2">Link 3</Button>
        </div>
      </motion.div>
    </>
  );
};

export default MobileSidebar;
