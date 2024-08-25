"use client";

import { useEffect, useState } from "react";
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import Loading from "@/app/loading";
import NotePageContent from "../../_components/NotePageContent";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface NoteData {
  id: string;
  title: string;
  emoji: string;
  banner: string;
  isPublished: boolean;
  publishedUrl: string;
  isTrash: boolean;
}

const NotePage: React.FC = () => {
  const [noteId, setNoteId] = useState<string | undefined>();
  const [noteData, setNoteData] = useState<NoteData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const noteIdFromUrl = window.location.pathname.split("/").pop();
    if (noteIdFromUrl) {
      setNoteId(noteIdFromUrl);
    }
  }, []);

  useEffect(() => {
    if (noteId) {
      const noteDocRef = doc(db, "notes", noteId);

      const unsubscribe = onSnapshot(noteDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data() as NoteData;
          setNoteData({ ...data, id: doc.id });
        }
      });

      return () => unsubscribe();
    }
  }, [noteId]);

  const handleUpdate = async (field: string, value: any) => {
    if (noteId) {
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, { [field]: value });
    }
  };

  const handleRestore = async (subpageId?: string) => {
    if (noteId) {
      const noteDocRef = doc(db, "notes", noteId);

      if (!subpageId) {
        // Restore main page
        await updateDoc(noteDocRef, { isTrash: false });
        toast.success("Page restored successfully");
      } else {
        // Restore subpage
        const noteSnapshot = await getDoc(noteDocRef);
        if (noteSnapshot.exists()) {
          const noteData = noteSnapshot.data();
          const updatedSubpages = noteData.subpages.map((sp: any) =>
            sp.id === subpageId ? { ...sp, isTrash: false } : sp
          );
          await updateDoc(noteDocRef, { subpages: updatedSubpages });
          toast.success("Subpage restored successfully");
        }
      }
    }
  };

  const handleDelete = async (subpageId?: string) => {
    if (noteId) {
      const noteDocRef = doc(db, "notes", noteId);

      if (!subpageId) {
        console.log(subpageId);
        // Delete main page
        await deleteDoc(noteDocRef);
        router.push("/dashboard");
        toast.success("Page deleted successfully");
      } else {
        // Delete subpage
        const noteSnapshot = await getDoc(noteDocRef);
        if (noteSnapshot.exists()) {
          const noteData = noteSnapshot.data();
          const updatedSubpages = noteData.subpages.filter(
            (sp: any) => sp.id !== subpageId
          );
          await updateDoc(noteDocRef, { subpages: updatedSubpages });
          toast.success("Subpage deleted successfully");
        }
      }
    }
  };

  // It successfully works for the noteId but not for subpageId fix this i store the subpage in the array of notes in my database 

  if (!noteData || !noteId) {
    return <Loading />;
  }

  return (
    <>
      <NotePageContent
        data={noteData}
        isSubpage={false}
        noteId={noteId}
        onUpdate={handleUpdate}
        onRestore={handleRestore}
        onDelete={handleDelete}
      />
    </>
  );
};

export default NotePage;
