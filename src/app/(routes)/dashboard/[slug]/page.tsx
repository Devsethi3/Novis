"use client";

import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import Loading from "@/app/loading";
import NotePageContent from "../../_components/NotePageContent";

export interface NoteData {
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
      />
    </>
  );
};

export default NotePage;
