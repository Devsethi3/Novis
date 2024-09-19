"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiSearch, FiSettings, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons/lib";
import { usePathname, useRouter } from "next/navigation";
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
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import useAuth from "@/lib/useAuth";
import { v4 as uuidv4 } from "uuid";
import SearchFilter from "./SearchFilter";
import toast from "react-hot-toast";
import TrashNotes from "./TrashNotes";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserButton from "@/components/UserButton";
import SettingsModal from "./SettingsModal";

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
  isTrash: boolean;
  subpages?: Subpage[];
}

interface Subpage {
  id: string;
  title: string;
  emoji: string;
  author: string;
  isTrash: boolean;
  createdAt?: Date;
  deletedAt?: Date;
}

const navItems: NavItem[] = [
  { icon: FiSearch, label: "Search", href: "#search", badge: "ctrl+k" },
  { icon: FiSettings, label: "Settings", href: "#settings", badge: "ctrl+s" },
  { icon: FiTrash2, label: "Trash", href: "#trash", badge: "ctrl+d" },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      } else if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        setIsTrashOpen(true);
      } else if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        setIsSettingsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      setLoading(true);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const noteList: Note[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();

          // Check if the page is not in the trash
          if (data.author === currentUser?.email && !data.isTrash) {
            // Filter out trashed subpages
            const filteredSubpages = (data.subpages || []).filter(
              (subpage: any) => !subpage.isTrash
            );

            // Push the note with filtered subpages to the noteList
            noteList.push({
              id: doc.id,
              title: data.title,
              emoji: data.emoji,
              isTrash: data.isTrash,
              author: data.author,
              subpages: filteredSubpages, // Only 
            });
          }
        });
        setNotes(noteList);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleCreatePage = async () => {
    if (currentUser) {
      const newPage = {
        title: "Untitled",
        isTrash: false,
        emoji: "📝",
        author: currentUser.email,
        createdAt: serverTimestamp(),
        subpages: [],
      };

      try {
        const docRef = await addDoc(collection(db, "notes"), newPage);
        router.push(`/dashboard/${docRef.id}`);
      } catch (error) {
        console.error("Error creating note:", error);
        toast.error("Failed to create page.");
      }
    }
  };

  const handleCreateSubpage = async (parentNoteId: string) => {
    if (currentUser) {
      const newSubpageId = uuidv4();
      const newSubpage = {
        id: newSubpageId,
        title: "Untitled File",
        emoji: "📄",
        author: currentUser.email,
        createdAt: new Date(),
        isTrash: false,
      };

      try {
        const parentDocRef = doc(db, "notes", parentNoteId);
        const parentDoc = await getDoc(parentDocRef);

        if (parentDoc.exists()) {
          const parentData = parentDoc.data();
          await updateDoc(parentDocRef, {
            subpages: [...(parentData.subpages || []), newSubpage],
          });
          router.push(`/dashboard/${parentNoteId}/${newSubpageId}`);
        }
      } catch (error) {
        console.error("Error creating subpage:", error);
      }
    }
  };

  const handleDeletePage = async (noteId: string) => {
    if (currentUser) {
      const noteRef = doc(db, "notes", noteId);
      try {
        await updateDoc(noteRef, {
          deleted: true,
          isTrash: true,
          deletedAt: serverTimestamp(),
        });
        toast.success("Note moved to trash");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error moving note to trash:", error);
        toast.error("Failed to move note to trash");
      }
    }
  };

  const handleDeleteSubpage = async (
    parentNoteId: string,
    subpageId: string
  ) => {
    if (currentUser) {
      const noteRef = doc(db, "notes", parentNoteId);
      try {
        const noteDoc = await getDoc(noteRef);
        if (noteDoc.exists()) {
          const noteData = noteDoc.data() as {
            subpages?: Subpage[];
          };
          if (noteData.subpages) {
            // Check if subpages is defined
            const updatedSubpages = noteData.subpages.map((subpage) => {
              // Use Subpage type here
              if (subpage.id === subpageId) {
                return {
                  ...subpage,
                  isTrash: true,
                  deletedAt: new Date(), // Optional, to track when it was marked as trash
                };
              }
              return subpage;
            });

            // Update document in the database
            await updateDoc(noteRef, {
              subpages: updatedSubpages,
            });

            // Update UI state to remove subpage
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === parentNoteId
                  ? {
                      ...note,
                      subpages:
                        note.subpages?.filter((sp) => sp.id !== subpageId) ||
                        [],
                    }
                  : note
              )
            );

            router.push("/dashboard");

            toast.success("Subpage moved to trash");
          }
        }
      } catch (error) {
        console.error("Error moving subpage to trash:", error);
        toast.error("Failed to move subpage to trash");
      }
    }
  };

  const renderNoteItem = (note: Note) => (
    <AccordionItem value={note.id} key={note.id}>
      <AccordionTrigger className="py-2 group">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="mr-2">{note.emoji}</span>
            <span
              className="text-sm line-clamp-1"
              onClick={() => router.push(`/dashboard/${note.id}`)}
            >
              {note.title}
            </span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleCreateSubpage(note.id);
              }}
            >
              <FiPlus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePage(note.id);
              }}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {note.subpages && note.subpages.length > 0 ? (
          <ul className="pl-4">
            {note.subpages.map((subpage, index) => (
              <li
                key={subpage.id}
                className="py-2 flex border-t items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="mr-2">{subpage.emoji}</span>
                  <Link
                    href={`/dashboard/${note.id}/${subpage.id}`}
                    className="text-sm cursor-pointer line-clamp-1 hover:underline"
                  >
                    {subpage.title}
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 px-2 mx-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSubpage(note.id, subpage.id);
                  }}
                >
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-2 px-4 text-sm text-muted-foreground">No files</p>
        )}
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="h-full bg-[#F0F4F3] dark:bg-[#111E19] overflow-y-auto z-20 relative flex shadow-xl border-r">
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
                  className="text-xl ml-2 font-bold"
                >
                  <div className="flex items-center gap-5">
                    <Image src="/logo.svg" alt="logo" width={40} height={40} />
                    <p>Novis</p>
                  </div>
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
                  {item.href === "#search" ? (
                    <SearchFilter
                      isOpen={isSearchOpen}
                      onOpenChange={setIsSearchOpen}
                      trigger={
                        <motion.div
                          className={cn(
                            "flex items-center rounded-md px-4 py-3 transition-colors duration-200",
                            "hover:bg-accent hover:text-accent-foreground",
                            "cursor-pointer"
                          )}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsSearchOpen(true)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <item.icon className="flex-shrink-0" />
                              <AnimatePresence>
                                {sidebarOpen && (
                                  <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-3 font-medium"
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                            {sidebarOpen && item.badge && (
                              <span className="bg-secondary px-2 py-1 text-sm rounded-md">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      }
                    />
                  ) : item.href === "#trash" ? (
                    <TrashNotes
                      isOpen={isTrashOpen}
                      onOpenChange={setIsTrashOpen}
                      trigger={
                        <motion.div
                          className={cn(
                            "flex items-center rounded-md px-4 py-3 transition-colors duration-200",
                            "hover:bg-accent hover:text-accent-foreground",
                            "cursor-pointer"
                          )}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsTrashOpen(true)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <item.icon className="flex-shrink-0" />
                              <AnimatePresence>
                                {sidebarOpen && (
                                  <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-3 font-medium"
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                            {sidebarOpen && (
                              <span className="bg-secondary px-2 py-1 text-sm rounded-md">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      }
                    />
                  ) : item.href === "#settings" ? (
                    <SettingsModal
                      isOpen={isSettingsOpen}
                      onOpenChange={setIsSettingsOpen}
                      trigger={
                        <motion.div
                          className={cn(
                            "flex items-center rounded-md px-4 py-3 transition-colors duration-200",
                            "hover:bg-accent hover:text-accent-foreground",
                            "cursor-pointer"
                          )}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsSettingsOpen(true)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <item.icon className="flex-shrink-0" />
                              <AnimatePresence>
                                {sidebarOpen && (
                                  <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-3 font-medium"
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                            {sidebarOpen && (
                              <span className="bg-secondary px-2 py-1 text-sm rounded-md">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      }
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          {sidebarOpen ? (
            <>
              <div className="px-4 mt-4 flex gap-4 justify-between items-center">
                <Button
                  variant="outline"
                  className="w-10/12"
                  size="sm"
                  onClick={handleCreatePage}
                >
                  <FiPlus className="mr-2" /> New Note
                </Button>
                <ThemeSwitcher />
              </div>
              <div className="px-4 mt-4 flex flex-col">
                <h2 className="text-sm font-semibold border-b pb-2">Notes</h2>
                <ScrollArea className="lg:h-[270px] h-[190px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-sm mt-2 text-center text-muted-foreground">
                      No notes yet. Create your first note to get started!
                    </div>
                  ) : (
                    <Accordion type="single" collapsible>
                      {notes.map(renderNoteItem)}
                    </Accordion>
                  )}
                </ScrollArea>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 mt-4 flex flex-col gap-4 justify-between items-center">
                <Button variant="outline" size="sm" onClick={handleCreatePage}>
                  <FiPlus />
                </Button>
                <ThemeSwitcher />
              </div>
            </>
          )}
          {sidebarOpen ? (
            <div className="p-4">
              <UserButton />
            </div>
          ) : null}
        </motion.aside>
      </IconContext.Provider>
    </div>
  );
};

export default Sidebar;
