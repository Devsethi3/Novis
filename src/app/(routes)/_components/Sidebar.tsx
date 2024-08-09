"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiSearch, FiSettings, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { IconContext } from "react-icons/lib";
import { usePathname } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: FiSearch, label: "Search", href: "/", badge: "ctrl+k" },
  { icon: FiSettings, label: "Settings", href: "/dashboard/settings" },
  { icon: IoAddCircleOutline, label: "New Page", href: "/dashboard/new-page" },
  { icon: FiTrash2, label: "Trash", href: "/dashboard/documents" },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-full overflow-y-auto relative flex shadow-xl border-r">
      <IconContext.Provider value={{ size: "1.3em" }}>
        <motion.aside
          initial={{ width: sidebarOpen ? 256 : 75 }}
          animate={{ width: sidebarOpen ? 256 : 75 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shadow-lg"
        >
          <div className="p-4 flex justify-between items-center">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold"
                >
                  Dashboard
                </motion.h1>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="hover:bg-accent hover:text-accent-foregroundrounded-full"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={sidebarOpen ? "open" : "closed"}>
                  {sidebarOpen ? (
                    <MdOutlineKeyboardDoubleArrowLeft />
                  ) : (
                    <MdOutlineKeyboardDoubleArrowRight />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
          <nav className="mt-3">
            <ul>
              {navItems.map((item) => (
                <li key={item.href} className="my-2 px-3">
                  <Link href={item.href} passHref>
                    <motion.div
                      className={cn(
                        "flex items-center rounded-md px-4 py-3 transition-colors duration-200",
                        "hover:bg-accent hover:text-accent-foreground",

                        isActive(item.href) &&
                          "bg-primary text-white hover:bg-primary hover:text-white"
                      )}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="flex-shrink-0" />
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 whitespace-nowrap text-sm font-medium"
                          >
                            {item.label}
                            {item.badge && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-secondary ml-4 px-2 py-1.5 rounded-lg text-xs opacity-65"
                              >
                                ctrl+k
                              </motion.span>
                            )}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.aside>
      </IconContext.Provider>
    </div>
  );
};

export default Sidebar;
