"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import toast from "react-hot-toast";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";

interface TrashNotesProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

interface TrashedItem {
  id: string;
  parentId?: string;
  title: string;
  emoji: string;
  deletedAt: Date;
  isSubpage: boolean;
}

const TrashNotes: React.FC<TrashNotesProps> = ({
  isOpen,
  onOpenChange,
  trigger,
}) => {
  const [trashedItems, setTrashedItems] = useState<TrashedItem[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isOpen && currentUser) {
      const unsubscribe = fetchTrashedItems();
      return () => unsubscribe();
    }
  }, [isOpen, currentUser]);

  const fetchTrashedItems = () => {
    if (!currentUser) return () => {};

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
            emoji: data.emoji,
            deletedAt: data.deletedAt?.toDate(),
            isSubpage: false,
          });
        }
        if (data.subpages) {
          data.subpages.forEach((subpage: any) => {
            if (subpage.isTrash) {
              items.push({
                id: subpage.id,
                parentId: doc.id,
                title: subpage.title,
                emoji: subpage.emoji,
                deletedAt: subpage.deletedAt?.toDate(),
                isSubpage: true,
              });
            }
          });
        }
      });
      setTrashedItems(items);
    });
  };

  const handleRestore = async (item: TrashedItem) => {
    try {
      if (item.isSubpage && item.parentId) {
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
      toast.success("Item restored successfully");
    } catch (error) {
      console.error("Error restoring item:", error);
      toast.error("Failed to restore item");
    }
  };

  const handleDelete = async (item: TrashedItem) => {
    try {
      if (item.isSubpage && item.parentId) {
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
  };

  return (
    <>
      {trigger}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              Trash
            </DialogTitle>
          </DialogHeader>
          {trashedItems.length === 0 ? (
            <p className="text-center text-muted-foreground my-6">
              No trashed items found.
            </p>
          ) : (
            <div className="overflow-auto max-h-[400px]">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 text-sm font-semibold text-muted-foreground">
                      Item
                    </th>
                    <th className="text-left p-2 text-sm font-semibold text-muted-foreground">
                      Deleted At
                    </th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {trashedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-none"
                    >
                      <td className="p-2 flex items-center space-x-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.isSubpage ? "Subpage" : "Page"}
                          </p>
                        </div>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {item.deletedAt?.toLocaleString()}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex space-x-2 justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(item)}
                          >
                            <FiRefreshCw className="mr-2 h-4 w-4" />
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item)}
                          >
                            <FiTrash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrashNotes;
