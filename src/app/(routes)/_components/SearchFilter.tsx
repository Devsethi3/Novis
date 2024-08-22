import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import Link from "next/link";
import { FiFile, FiFolder, FiSearch, FiTrash2 } from "react-icons/fi";
import useAuth from "@/lib/useAuth";

interface SearchFilterProps {
  trigger: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchItem {
  id: string;
  title: string;
  type: "page" | "subpage";
  parentId?: string;
  parentTitle?: string; // Added this field
  isTrash: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  trigger,
  isOpen,
  onOpenChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth(); // Get the current user

  useEffect(() => {
    if (isOpen && currentUser) {
      setSearchTerm("");
      fetchItems();
    }
  }, [isOpen, currentUser]);

  const fetchItems = async () => {
    if (!currentUser) return;

    setLoading(true);
    const notesQuery = query(
      collection(db, "notes"),
      where("author", "==", currentUser.email)
    );
    const notesSnapshot = await getDocs(notesQuery);

    const fetchedItems: SearchItem[] = [];

    notesSnapshot.forEach((doc) => {
      const data = doc.data();
      const parentTitle = data.title || "Untitled"; // Set parent title

      fetchedItems.push({
        id: doc.id,
        title: parentTitle,
        type: "page",
        isTrash: data.isTrash || false,
      });

      if (data.subpages && Array.isArray(data.subpages)) {
        data.subpages.forEach((subpage: any) => {
          fetchedItems.push({
            id: subpage.id,
            title: subpage.title || "Untitled",
            type: "subpage",
            parentId: doc.id,
            parentTitle: parentTitle, // Set parent title for subpage
            isTrash: subpage.isTrash || false,
          });
        });
      }
    });

    setItems(fetchedItems);
    setLoading(false);
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function truncateText(text: string, wordLimit: number) {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <div onClick={() => onOpenChange(true)}>{trigger}</div>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-2xl font-bold mb-2">
            Search Notes
          </DialogTitle>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              placeholder="Type to search..."
              className="pl-10 pr-4 py-2 w-full border-2 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>
        <ScrollArea className="h-[400px] p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={
                    item.type === "page"
                      ? `/dashboard/${item.id}`
                      : `/dashboard/${item.parentId}/${item.id}`
                  }
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg transition-colors duration-200",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => onOpenChange(false)}
                >
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
                    <div className="font-medium line-clamp-1">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        {item.type === "page" ? "Page" : "Subpage"}
                        {item.type === "subpage" && item.parentTitle && (
                          <>
                            {item.parentTitle && (
                              <span className="mx-1">/</span>
                            )}
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              Parent: {truncateText(item.parentTitle, 4)}
                            </div>
                          </>
                        )}
                        {item.isTrash && (
                          <span className="ml-2 text-red-500 text-xs">
                            (In Trash)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {item.isTrash && (
                    <FiTrash2 className="text-red-500 w-5 h-5" />
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <FiSearch className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchFilter;
