"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { db } from "@/lib/firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import Image from "next/image";
import useAuth from "@/lib/useAuth";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { currentUser, handleLogout, loading } = useAuth();

  console.log(currentUser);

  const handleCreateNote = async () => {
    try {
      const noteRef = await addDoc(collection(db, "notes"), {
        title: "Untitled",
        emoji: "📝",
        author: currentUser?.email,
        isTrash: false,
        createdAt: serverTimestamp(),
        subpages: [],
      });

      router.push(`/dashboard/${noteRef.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note.");
    }
  };

  return (
    <div>
      <div className="h-screen flex items-center gap-10 justify-center flex-col w-full">
        <Image src="/create.svg" width={400} height={400} alt="create_a_note" />
        <Button onClick={handleCreateNote} className="text-lg py-6">
          Create a note
          <IoMdAddCircleOutline className="font-bold ml-3" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
