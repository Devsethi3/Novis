"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import UploadBanner from "../../_components/UploadBanner";

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
  const [isBreadcrumbEditing, setIsBreadcrumbEditing] = useState(false);
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

  const handleTitleChange = async () => {
    if (noteId && newTitle !== noteData?.title) {
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, { title: newTitle });
    }
    setIsEditing(false);
    setIsBreadcrumbEditing(false);
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
    <div>
      <div className="w-full flex h-[7vh] px-6 items-center justify-between">
        {isBreadcrumbEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleTitleChange();
            }}
            autoFocus
            className="font-medium bg-transparent outline-none"
          />
        ) : (
          <p
            className="font-medium cursor-pointer"
            onDoubleClick={() => setIsBreadcrumbEditing(true)}
          >
            {noteData.title}
          </p>
        )}
        <Button>Publish</Button>
      </div>
      <div className="min-h-[90vh] w-full">
        <div className="py-24 px-32">
          <div className="relative mb-10">
            <span
              className="text-5xl cursor-pointer"
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

          <div className="relative group">
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
                className="text-4xl bg-transparent font-bold outline-none"
              />
            ) : (
              <h1
                className="text-4xl font-bold cursor-pointer"
                onDoubleClick={() => setIsEditing(true)}
              >
                {noteData.title}
              </h1>
            )}
            <div
              className="absolute top-[-2.5rem] left-20 opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible
                transition-all duration-300 ease-in-out 
                transform group-hover:translate-y-[-10px]"
            >
              <UploadBanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePage;
