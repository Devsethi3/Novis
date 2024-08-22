"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import Loading from "@/app/loading";
import NotePageContent from "@/app/(routes)/_components/NotePageContent";

interface SubpageData {
  id: string;
  title: string;
  emoji: string;
  banner: string;
}

const SubpagePage: React.FC = () => {
  const [noteId, setNoteId] = useState<string | undefined>();
  const [subpageId, setSubpageId] = useState<string | undefined>();
  const [subpageData, setSubpageData] = useState<SubpageData | null>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const noteIdFromUrl = pathParts[pathParts.length - 2];
    const subpageIdFromUrl = pathParts[pathParts.length - 1];
    if (noteIdFromUrl && subpageIdFromUrl) {
      setNoteId(noteIdFromUrl);
      setSubpageId(subpageIdFromUrl);
    }
  }, []);

  useEffect(() => {
    if (noteId && subpageId) {
      const noteDocRef = doc(db, "notes", noteId);

      const unsubscribe = onSnapshot(noteDocRef, (doc) => {
        if (doc.exists()) {
          const noteData = doc.data();
          const subpage = noteData.subpages.find(
            (sp: any) => sp.id === subpageId
          );
          if (subpage) {
            setSubpageData(subpage as SubpageData);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [noteId, subpageId]);

  const handleUpdate = async (field: string, value: any) => {
    if (noteId && subpageId) {
      const noteDocRef = doc(db, "notes", noteId);
      const noteSnapshot = await getDoc(noteDocRef);
      if (noteSnapshot.exists()) {
        const noteData = noteSnapshot.data();
        const updatedSubpages = noteData.subpages.map((sp: any) =>
          sp.id === subpageId ? { ...sp, [field]: value } : sp
        );
        await updateDoc(noteDocRef, { subpages: updatedSubpages });
      }
    }
  };

  if (!subpageData || !noteId) {
    return <Loading />;
  }

  return (
    <NotePageContent
      // @ts-ignore
      data={subpageData}
      isSubpage={true}
      noteId={noteId}
      onUpdate={handleUpdate}
    />
  );
};

export default SubpagePage;
