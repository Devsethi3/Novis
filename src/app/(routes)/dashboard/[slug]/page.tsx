// /dashboard/ [slug] / page.tsx

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
  subpages?: { id: string; isTrash: boolean; deletedAt: Date | null }[];
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

  // const handleRestore = async (subpageId?: string) => {
  //   if (noteId) {
  //     const noteDocRef = doc(db, "notes", noteId);

  //     try {
  //       if (!subpageId) {
  //         // Restore the main note
  //         await updateDoc(noteDocRef, {
  //           isTrash: false,
  //           deletedAt: null,
  //         });
  //         toast.success("Note restored successfully");
  //         router.push(`/dashboard/${noteId}`);
  //       } else {
  //         // Restore a subpage
  //         const noteSnapshot = await getDoc(noteDocRef);
  //         if (noteSnapshot.exists()) {
  //           const noteData = noteSnapshot.data();
  //           const updatedSubpages = noteData.subpages.map((sp: any) =>
  //             sp.id === subpageId
  //               ? { ...sp, isTrash: false, deletedAt: null }
  //               : sp
  //           );
  //           await updateDoc(noteDocRef, { subpages: updatedSubpages });
  //           toast.success("Subpage restored successfully");
  //           router.push(`/dashboard/${noteId}`);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error restoring note or subpage:", error);
  //       toast.error("Failed to restore note or subpage");
  //     }
  //   }
  // };

  // const handleDelete = async (subpageId?: string) => {
  //   if (noteId) {
  //     const noteDocRef = doc(db, "notes", noteId);

  //     try {
  //       if (!subpageId) {
  //         // Delete the main note
  //         await deleteDoc(noteDocRef);
  //         toast.success("Note deleted permanently");
  //         router.push("/dashboard");
  //       } else {
  //         // Delete a subpage
  //         const noteSnapshot = await getDoc(noteDocRef);
  //         if (noteSnapshot.exists()) {
  //           const noteData = noteSnapshot.data();
  //           const updatedSubpages = noteData.subpages.filter(
  //             (sp: any) => sp.id !== subpageId
  //           );
  //           await updateDoc(noteDocRef, { subpages: updatedSubpages });
  //           toast.success("Subpage deleted permanently");
  //           router.push(`/dashboard/${noteId}`);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error deleting note or subpage:", error);
  //       toast.error("Failed to delete note or subpage");
  //     }
  //   }
  // };

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
        // onRestore={handleRestore}
        // onDelete={handleDelete}
      />
    </>
  );
};

export default NotePage;
