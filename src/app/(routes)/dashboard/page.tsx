"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { db } from "@/lib/firebase.config";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-hot-toast";

const DashboardPage: React.FC = () => {
  const router = useRouter();

  const handleCreateNote = async () => {
    try {
      const noteRef = await addDoc(collection(db, "notes"), {
        title: "Untitled",
        emoji: "📝", // Default emoji
        banner: "",
        createdAt: new Date(),
      });

      // Redirect to the dynamic route with the note ID
      router.push(`/dashboard/${noteRef.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col w-full">
      <Button onClick={handleCreateNote} className="text-lg py-6">
        Create a note
        <IoMdAddCircleOutline className="font-bold ml-3" size={20} />
      </Button>
    </div>
  );
};

export default DashboardPage;
