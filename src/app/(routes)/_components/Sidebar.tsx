"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiSearch,
  FiSettings,
  FiTrash2,
  FiPlus,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons/lib";
import { usePathname, useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
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
  author: string;
  subpages?: Note[];
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
  const router = useRouter();

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
          const data = doc.data();
          if (data.author === currentUser?.email) {
            noteList.push({
              id: doc.id,
              title: data.title,
              emoji: data.emoji,
              author: data.author,
              subpages: data.subpages || [],
            });
          }
        });
        setNotes(noteList);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleCreatePage = async (parentNoteId?: string) => {
    if (currentUser) {
      const newNote = {
        title: "Untitled Page",
        emoji: "📝",
        author: currentUser.email,
        createdAt: serverTimestamp(),
        subpages: [],
      };

      if (parentNoteId) {
        const parentDocRef = doc(db, "notes", parentNoteId);
        const parentDoc = await parentDocRef.get();
        if (parentDoc.exists()) {
          const parentData = parentDoc.data();
          await updateDoc(parentDocRef, {
            subpages: [...(parentData.subpages || []), newNote],
          });
        }
      } else {
        await addDoc(collection(db, "notes"), newNote);
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (currentUser) {
      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, {
        deleted: true,
        deletedAt: serverTimestamp(),
      });
    }
  };

  const renderNoteItem = (note: Note, depth = 0) => (
    <AccordionItem
      onClick={() => router.push(`/dashboard/${note.id}`)}
      value={note.id}
      key={note.id}
    >
      <AccordionTrigger className="py-2 px-4 hover:bg-accent group">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="mr-2">{note.emoji}</span>
            <span className="text-sm line-clamp-1">{note.title}</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleCreatePage(note.id)}
            >
              <FiPlus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDeleteNote(note.id)}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FiMoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {note.subpages && note.subpages.length > 0 ? (
          <ul className="pl-4">
            {note.subpages.map((subpage) => renderNoteItem(subpage, depth + 1))}
          </ul>
        ) : (
          <p className="py-2 px-4 text-sm text-muted-foreground">No subpages</p>
        )}
      </AccordionContent>
    </AccordionItem>
  );

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
              className="hover:bg-accent hover:text-accent-foreground rounded-full"
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
                                {item.badge}
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
                <li className="my-3 mt-8">
                  <Accordion type="single" collapsible>
                    <p className="text-xs mb-1 uppercase font-semibold tracking-wider text-muted-foreground px-4">
                      Notes
                    </p>
                    {notes.map((note) => renderNoteItem(note))}
                  </Accordion>
                </li>
              )}
            </ul>
          </nav>

          <div className="absolute bottom-4 left-0 w-full">
            <ThemeSwitcher />
          </div>
        </motion.aside>
      </IconContext.Provider>
    </div>
  );
};

export default Sidebar;
