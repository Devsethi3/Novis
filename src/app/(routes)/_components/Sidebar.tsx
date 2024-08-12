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
import { useState, useEffect } from "react";
import { IconContext } from "react-icons/lib";
import { usePathname } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import useAuth from "@/lib/useAuth";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

interface Note {
  id: string;
  title: string;
  emoji: string;
}

const navItems: NavItem[] = [
  { icon: FiSearch, label: "Search", href: "/", badge: "ctrl+k" },
  { icon: FiSettings, label: "Settings", href: "/dashboard/settings" },
  { icon: IoAddCircleOutline, label: "New Page", href: "/dashboard/new-page" },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const { currentUser } = useAuth();
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const noteList: Note[] = [];
        snapshot.forEach((doc) => {
          noteList.push({
            id: doc.id,
            title: doc.data().title,
            emoji: doc.data().emoji,
          });
        });
        setNotes(noteList);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  return (
    <div className="h-full bg-secondary/40 overflow-y-auto relative flex shadow-xl border-r">
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

              {sidebarOpen && (
                <li className="my-2 px-3">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="notes">
                      <ul className="mt-2">
                        {notes.map((note) => (
                          <AccordionTrigger className="py-2 px-4">
                            <li key={note.id} className="line-clamp-1">
                              <Link href={`/dashboard/${note.id}`} passHref>
                                <motion.div
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <span className="">{note.emoji}</span>
                                  <span className="text-sm">{note.title}</span>
                                </motion.div>
                              </Link>
                            </li>
                          </AccordionTrigger>
                        ))}
                      </ul>
                      <AccordionContent>There is nothing</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </li>
              )}

              <li className="my-2 px-3">
                <Link href="/dashboard/trash" passHref>
                  <motion.div
                    className={cn(
                      "flex items-center rounded-md px-4 py-3 transition-colors duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive("/dashboard/trash") &&
                        "bg-primary text-white hover:bg-primary hover:text-white"
                    )}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiTrash2 className="flex-shrink-0" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 whitespace-nowrap text-sm font-medium"
                        >
                          Trash
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </li>
            </ul>
          </nav>
        </motion.aside>
      </IconContext.Provider>

      <div className="absolute bottom-10 mx-4">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Sidebar;

// Now check this and improve this Component in according for each page, and on hover of that page show the plus and more icon to create and delete the. Try to make the file tree like notion with this existing code 