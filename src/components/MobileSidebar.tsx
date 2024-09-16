"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import SettingsModal from "@/app/(routes)/_components/SettingsModal";
import TrashNotes from "@/app/(routes)/_components/TrashNotes";
import SearchFilter from "@/app/(routes)/_components/SearchFilter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FiSearch, FiSettings, FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons/lib";
import { usePathname } from "next/navigation";
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
  { icon: FiSearch, label: "Search", href: "#search" },
  { icon: FiTrash2, label: "Trash", href: "#trash" },
  { icon: FiSettings, label: "Settings", href: "#settings" },
];

const MobileSidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();
  const { currentUser, loading, handleLogout } = useAuth();

  const logOut = async () => {
    try {
      await handleLogout();
      router.push("/");
      toast.success("Successfully logged out!", {
        style: {
          border: "1px solid #50C878", // Emerald color border
          padding: "12px 16px",
          color: "#155724", // Dark green text for success message
        },
        iconTheme: {
          primary: "#50C878", // Emerald color for the icon
          secondary: "#F0FFF4", // Light green background for the icon
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
      toast.error("Failed to logout!");
    }
  };

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
  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      setIsLoading(true);

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
              subpages: filteredSubpages, // Only non-trashed subpages
            });
          }
        });
        setNotes(noteList);
        setIsLoading(false);
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

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }
    if (maxLength <= 3) {
      return "...";
    }
    return `${text.slice(0, maxLength - 3)}...`;
  }

  const renderNoteItem = (note: Note) => (
    <AccordionItem value={note.id} key={note.id}>
      <AccordionTrigger className="py-2 group">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="mr-3">{note.emoji}</span>
            <span
              className="relative text-sm cursor-pointer whitespace-nowrap max-w-44 line-clamp-1 overflow-hidden hover:underline"
              onClick={() => router.push(`/dashboard/${note.id}`)}
            >
              {note.title}
              {note.title.length > 30 && (
                <span className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent"></span>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-2">
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
            {note.subpages.map((subpage) => (
              <li
                key={subpage.id}
                className="py-2 flex border-t items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="mr-2">{subpage.emoji}</span>
                  <Link
                    href={`/dashboard/${note.id}/${subpage.id}`}
                    className="relative text-sm cursor-pointer hover:underline whitespace-nowrap max-w-48 line-clamp-1 overflow-hidden"
                  >
                    {subpage.title}
                    {subpage.title.length > 30 && (
                      <span className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent"></span>
                    )}
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
    <>
      <div className="fixed top-[.9rem] right-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="sidebarMenu"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="focus:outline-none bg-background/80 backdrop-blur-sm"
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
              <div className="flex items-center gap-4">
                <ThemeSwitcher />

                <Button
                  variant="outline"
                  size="sidebarMenu"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <IoClose className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="flex-grow flex flex-col">
              <div className="p-4">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleCreatePage}
                >
                  <FaPlus className="mr-2 opacity-80" /> Create New Page
                </Button>
              </div>

              <h2 className="font-semibold border-b mb-1 p-4">Recent Notes</h2>
              <ScrollArea className="h-[340px] mx-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="text-sm mt-2 text-center text-muted-foreground">
                    Your recent notes will appear here
                  </div>
                ) : (
                  <Accordion type="single" collapsible>
                    {notes.map(renderNoteItem)}
                  </Accordion>
                )}
              </ScrollArea>
            </div>
            {/*  */}
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <nav className="flex-1">
                  <ul className="flex justify-around">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleNavItemClick(item.href)}
                        >
                          <item.icon className="h-6 w-6" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </nav>
                {/* <div className="w-7 h-7 rounded-full ml-5 mr-8 bg-secondary"></div> */}
                {currentUser && currentUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <Image
                        src={currentUser.photoURL || "/placeholder.png"}
                        alt="User Profile"
                        width={40}
                        height={40}
                        className="rounded-full w-9 hover:bg-secondary-foreground/10 h-9 ml-6
                         mr-8 object-cover cursor-pointer"
                      />{" "}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 m-3">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Link href="/dashboard" className="flex items-center">
                            <MdDashboard className="mr-4 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={logOut}
                        className="cursor-pointer"
                      >
                        <FaSignOutAlt className="mr-4 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Loader className="w-8 h-8 animate-spin ml-5 mr-8" />
                )}

                {/* <ThemeSwitcher /> */}
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
