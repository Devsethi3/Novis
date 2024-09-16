"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { FiSearch, FiSettings, FiTrash2, FiPlus } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UserButton from "@/components/UserButton";
import SettingsModal from "@/app/(routes)/_components/SettingsModal";
import TrashNotes from "@/app/(routes)/_components/TrashNotes";
import SearchFilter from "@/app/(routes)/_components/SearchFilter";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: FiSearch, label: "Search", href: "#search" },
  { icon: FiSettings, label: "Settings", href: "#settings" },
  { icon: FiTrash2, label: "Trash", href: "#trash" },
];

const MobileSidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const sidebarVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const handleNavItemClick = (href: string) => {
    switch (href) {
      case "#search":
        setIsSearchOpen(true);
        break;
      case "#trash":
        setIsTrashOpen(true);
        break;
      case "#settings":
        setIsSettingsOpen(true);
        break;
      default:
        console.log(`Clicked on ${href}`);
    }
    setIsSidebarOpen(false);
  };

  const handleCreateNote = () => {
    console.log("Create new note");
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="fixed top-[0.9rem] right-4 z-50 md:hidden">
        <Button
          variant="secondary"
          size="sidebarMenu"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="focus:outline-none"
        >
          <HiMenu className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl z-50 flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center space-x-2">
                <Image src="/logo.svg" alt="logo" width={32} height={32} />
                <h2 className="text-xl font-bold">Novis</h2>
              </div>
              <Button
                variant="ghost"
                size="sidebarMenu"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IoClose className="h-6 w-6" />
              </Button>
            </div>

            <ScrollArea className="flex-grow">
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-gray-100 bg-secondary/50 transition-colors"
                        onClick={() => handleNavItemClick(item.href)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4">
                <Button
                  variant="outline"
                  className="w-full hover:bg-gray-100 transition-colors"
                  onClick={handleCreateNote}
                >
                  <FiPlus className="mr-2" /> New Note
                </Button>
              </div>

              <div className="p-4">
                <h2 className="text-sm font-semibold mb-2">Notes</h2>
                {/* Placeholder for notes list */}
                <p className="text-sm text-muted-foreground">
                  Your notes will appear here
                </p>
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <UserButton />
                <ThemeSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchFilter
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        trigger={null}
      />
      <TrashNotes
        isOpen={isTrashOpen}
        onOpenChange={setIsTrashOpen}
        trigger={null}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        trigger={null}
      />
    </>
  );
};

export default MobileSidebar;
