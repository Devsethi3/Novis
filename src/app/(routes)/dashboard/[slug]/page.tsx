"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { Button } from "@/components/ui/button";

interface NoteData {
  title: string;
  emoji: string;
  banner: string;
}

const NotePage: React.FC = () => {
  const router = useRouter();
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
          setNoteData(doc.data() as NoteData);
        }
      });

      return () => unsubscribe();
    }
  }, [noteId]);

  const handleUploadBanner = async () => {
    const newBannerUrl = "https://via.placeholder.com/728x90.png"; // Example URL

    if (noteId) {
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, { banner: newBannerUrl });
    }
  };

  if (!noteData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center w-full">
      {noteData.banner ? (
        <img
          src={noteData.banner}
          alt="Banner"
          className="mt-4 w-96 h-32 object-cover"
        />
      ) : (
        <Button onClick={handleUploadBanner} className="mt-4">
          Upload Banner
        </Button>
      )}
      <h1 className="text-4xl font-bold">{noteData.title}</h1>
      <p className="text-6xl">{noteData.emoji}</p>
    </div>
  );
};

export default NotePage;
