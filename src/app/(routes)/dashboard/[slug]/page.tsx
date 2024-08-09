"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";

interface NoteData {
  title: string;
  emoji: string;
  banner: string;
}

const NotePage: React.FC = () => {
  const router = useRouter();
  const [noteId, setNoteId] = useState<string | undefined>();
  const [noteData, setNoteData] = useState<NoteData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState<string>("");

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
          setNoteData(data);
          setNewTitle(data.title);
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

  const handleTitleChange = async () => {
    if (noteId && newTitle !== noteData?.title) {
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, { title: newTitle });
    }
    setIsEditing(false);
  };

  if (!noteData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full">
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
      <div className="py-24 px-32">
        <p className="text-6xl mb-16">{noteData.emoji}</p>

        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleTitleChange();
            }}
            autoFocus
            className="text-4xl font-bold border-b border-gray-400 outline-none"
          />
        ) : (
          <h1
            className="text-4xl font-bold cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
          >
            {noteData.title}
          </h1>
        )}
      </div>
    </div>
  );
};

export default NotePage;
