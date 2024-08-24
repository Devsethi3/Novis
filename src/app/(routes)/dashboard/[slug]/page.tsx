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

  const handleRestore = async () => {
    if (noteId) {
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, { isTrash: false });
    }
  };

  const handleDelete = async () => {
    if (noteId) {
      try {
        const noteDocRef = doc(db, "notes", noteId);
        await deleteDoc(noteDocRef);
        router.push("/dashboard");
        toast.success("Note deleted successfully");
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
      }
    }
  };

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
