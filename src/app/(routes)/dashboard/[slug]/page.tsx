"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

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
    const newBannerUrl = "https://via.placeholder.com/728x90.png"; // Example

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

  const handleEmojiSelect = async (emojiData: EmojiClickData) => {
    const selectedEmoji = emojiData.emoji;
    if (noteId && selectedEmoji !== noteData?.emoji) {
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, { emoji: selectedEmoji });
    }
    setShowEmojiPicker(false);
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
        <div className="relative mb-16">
          <span
            className="text-6xl cursor-pointer"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            {noteData.emoji}
          </span>
          {showEmojiPicker && (
            <div className="absolute top-16 left-0 z-10">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
        </div>

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
            className="text-4xl font-bold outline-none"
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
