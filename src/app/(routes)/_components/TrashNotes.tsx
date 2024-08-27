"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import useAuth from "@/lib/useAuth";
import {
  FiTrash2,
  FiRefreshCw,
  FiFile,
  FiFolder,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface TrashNotesProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

interface TrashedItem {
  id: string;
  parentId?: string;
  title: string;
  type: "page" | "subpage";
  deletedAt: Date;
}

const TrashNotes: React.FC<TrashNotesProps> = ({
  isOpen,
  onOpenChange,
  trigger,
}) => {
  const [trashedItems, setTrashedItems] = useState<TrashedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isOpen && currentUser) {
      setSearchTerm("");
      const unsubscribe = fetchTrashedItems();
      return () => unsubscribe();
    }
  }, [isOpen, currentUser]);

  const fetchTrashedItems = () => {
    if (!currentUser) return () => {};

    setLoading(true);
    const q = query(
      collection(db, "notes"),
      where("author", "==", currentUser.email)
    );

    return onSnapshot(q, (snapshot) => {
      const items: TrashedItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isTrash) {
          items.push({
            id: doc.id,
            title: data.title,
            type: "page",
            deletedAt: data.deletedAt?.toDate(),
          });
        }
        if (data.subpages) {
          data.subpages.forEach((subpage: any) => {
            if (subpage.isTrash) {
              items.push({
                id: subpage.id,
                parentId: doc.id,
                title: subpage.title,
                type: "subpage",
                deletedAt: subpage.deletedAt?.toDate(),
              });
            }
          });
        }
      });
      setTrashedItems(items);
      setLoading(false);
    });
  };

  const handleRestore = useCallback(async (item: TrashedItem) => {
    try {
      if (item.type === "subpage" && item.parentId) {
        const parentRef = doc(db, "notes", item.parentId);
        await updateDoc(parentRef, {
          subpages: arrayRemove({ ...item, isTrash: true }),
        });
        await updateDoc(parentRef, {
          subpages: arrayUnion({ ...item, isTrash: false, deletedAt: null }),
        });
      } else {
        await updateDoc(doc(db, "notes", item.id), {
          isTrash: false,
          deletedAt: null,
        });
      }
      toast.success("Item restored succesfully!");
    } catch (error) {
      console.error("Error restoring item:", error);
      toast.error("Failed to restore item");
    }
  }, []);

  const handleDelete = useCallback(async (item: TrashedItem) => {
    try {
      if (item.type === "subpage" && item.parentId) {
        const parentRef = doc(db, "notes", item.parentId);
        await updateDoc(parentRef, {
          subpages: arrayRemove({ ...item, isTrash: true }),
        });
      } else {
        await deleteDoc(doc(db, "notes", item.id));
      }
      toast.success("Item permanently deleted");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  }, []);

  const handleBulkRestore = async () => {
    for (const itemId of selectedItems) {
      const item = trashedItems.find((i) => i.id === itemId);
      if (item) await handleRestore(item);
    }
    setSelectedItems([]);
  };

  const handleBulkDelete = async () => {
    for (const itemId of selectedItems) {
      const item = trashedItems.find((i) => i.id === itemId);
      if (item) await handleDelete(item);
    }
    setSelectedItems([]);
  };

  const filteredItems = trashedItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {trigger}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-2xl font-bold mb-2">Trash</DialogTitle>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search trashed items..."
                className="pl-10 pr-4 py-2 w-full border-2 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </DialogHeader>
          <div className="p-4">
            {selectedItems.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <span>{selectedItems.length} items selected</span>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkRestore}
                    className="mr-2"
                  >
                    <FiRefreshCw className="mr-2 h-4 w-4" />
                    Restore Selected
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            )}
          </div>
          <ScrollArea className="h-[500px] p-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg animate-pulse"
                  >
                    <div className="w-10 h-10 bg-secondary rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-secondary rounded w-3/4"></div>
                      <div className="h-3 bg-secondary rounded w-1/2"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-20 h-8 bg-secondary rounded"></div>
                      <div className="w-20 h-8 bg-secondary rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg transition-colors duration-200",
                      "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => {
                        setSelectedItems(
                          checked
                            ? [...selectedItems, item.id]
                            : selectedItems.filter((id) => id !== item.id)
                        );
                      }}
                    />
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        item.type === "page"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      )}
                    >
                      {item.type === "page" ? (
                        <FiFolder className="w-5 h-5" />
                      ) : (
                        <FiFile className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Deleted: {item.deletedAt.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(item)}
                        className="w-8 h-8 p-0"
                      >
                        <FiRefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="w-8 h-8 p-0"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                {searchTerm ? (
                  <>
                    <FiSearch className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium">Your trash is empty</p>
                    <p className="text-sm">
                      Items you delete will appear here for 30 days
                    </p>
                  </>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrashNotes;

// I am building a notion like project in next js, typescript and firebase for backend. Improve the ui for this component that enhances user experiences
// Start this existing code and it should be perfectly responsive on all screen devices with a best ui for better user experience After that provide the full updated code
// without use any external library, use only shadcn ui colors (primary,secondary,accent) and component
