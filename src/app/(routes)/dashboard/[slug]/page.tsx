// /dashboard/[slug]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase.config";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import UploadBanner from "../../_components/UploadBanner";
import { IoClose } from "react-icons/io5";

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
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

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
          if (data.banner) {
            const bannerRef = ref(storage, data.banner);
            getDownloadURL(bannerRef).then(setBannerUrl);
          } else {
            setBannerUrl(null);
          }
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

  const handleRemoveBanner = async () => {
    if (noteId && noteData?.banner) {
      // Delete the banner from Firebase Storage
      const bannerRef = ref(storage, noteData.banner);
      try {
        await deleteObject(bannerRef);
      } catch (error) {
        console.error("Error deleting banner from storage:", error);
      }

      // Update the Firestore document
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, { banner: null });
    }
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
      <div className="min-h-[190vh] w-full">
        <div className="">
          {bannerUrl && (
            <div className="mb-10 relative">
              <img
                src={bannerUrl}
                alt="Note banner"
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <UploadBanner noteId={noteId!} currentBanner={bannerUrl} />
                <Button variant="secondary" onClick={handleRemoveBanner}>
                  <IoClose className="mr-2" size={18} />
                  Remove Banner
                </Button>
              </div>
            </div>
          )}
          <div className="flex items-center mx-20 border-t border-b py-8 justify-between">
            <div className="flex items-center gap-8">
              <div className="relative">
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
              </div>
            </div>

            {!bannerUrl && <UploadBanner noteId={noteId!} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePage;
