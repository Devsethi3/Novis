"use client";

import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase.config";
import { Button } from "@/components/ui/button";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { IoClose } from "react-icons/io5";
import UploadBanner from "./UploadBanner";
import TextEditor from "./TextEditor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbWorld } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import GenerateAIContent from "./GenerateAIContent";

interface NoteData {
  id: string;
  title: string;
  emoji: string;
  banner: string;
  isPublished: boolean;
  publishedUrl: string | null;
}

interface NotePageContentProps {
  data: NoteData;
  isSubpage: boolean;
  noteId: string;
  onUpdate: (field: string, value: any) => Promise<void>;
}

const NotePageContent: React.FC<NotePageContentProps> = ({
  data,
  isSubpage,
  noteId,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isBreadcrumbEditing, setIsBreadcrumbEditing] = useState(false);
  const [newTitle, setNewTitle] = useState<string>(data.title);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(data.isPublished);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(
    data.publishedUrl
  );

  useEffect(() => {
    if (data.banner) {
      const bannerRef = ref(storage, data.banner);
      getDownloadURL(bannerRef).then(setBannerUrl);
    } else {
      setBannerUrl(null);
    }
  }, [data.banner]);

  const handleTitleChange = async () => {
    if (newTitle !== data.title) {
      await onUpdate("title", newTitle);
      toast.success("Title updated successfully");
    }
    setIsEditing(false);
    setIsBreadcrumbEditing(false);
  };

  const handleBannerUpdate = (url: string) => {
    onUpdate("banner", url);
    toast.success("Banner updated successfully");
  };

  const handleEmojiSelect = async (emojiData: EmojiClickData) => {
    const selectedEmoji = emojiData.emoji;
    if (selectedEmoji !== data.emoji) {
      await onUpdate("emoji", selectedEmoji);
      toast.success("Emoji updated successfully");
    }
    setShowEmojiPicker(false);
  };

  const handleRemoveBanner = async () => {
    if (data.banner) {
      const bannerRef = ref(storage, data.banner);
      try {
        await deleteObject(bannerRef);
        await onUpdate("banner", null);
        toast.success("Banner removed successfully");
      } catch (error) {
        console.error("Error deleting banner from storage:", error);
        toast.error("Failed to remove banner");
      }
    }
  };

  const handlePublish = async () => {
    const newPublishedUrl = isSubpage
      ? `/published/${noteId}/${data.id}`
      : `/published/${noteId}`;

    try {
      await onUpdate("isPublished", true);
      await onUpdate("publishedUrl", newPublishedUrl);
      setIsPublished(true);
      setPublishedUrl(newPublishedUrl);
      toast.success("Note published successfully");
    } catch (error) {
      console.error("Error publishing note:", error);
      toast.error("Failed to publish note");
    }
  };

  const handleUnpublish = async () => {
    try {
      await onUpdate("isPublished", false);
      await onUpdate("publishedUrl", null);
      setIsPublished(false);
      setPublishedUrl(null);
      toast.success("Note unpublished successfully");
    } catch (error) {
      console.error("Error unpublishing note:", error);
      toast.error("Failed to unpublish note");
    }
  };

  const copyPublishedUrl = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(`${window.location.origin}${publishedUrl}`);
      toast.success("Published URL copied to clipboard");
    }
  };

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
            {data.title}
          </p>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>{isPublished ? "Published" : "Publish"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 m-2 shadow-xl">
            <div className="flex items-center flex-col px-4 py-3">
              <TbWorld size={30} className="opacity-60" />
              <h3 className="text-xl font-bold text-center mt-2 opacity-60">
                {isPublished ? "Manage publication" : "Publish this note"}
              </h3>
              <p className="text-sm text-center mt-1">
                {isPublished
                  ? "Your note is live on the web"
                  : "Share your work with others"}
              </p>
              {isPublished ? (
                <div className="w-full mt-4 space-y-2">
                  <Input
                    type="text"
                    value={`${window.location.origin}${publishedUrl}`}
                    readOnly
                    className="bg-gray-100 px-3 py-2 rounded text-sm"
                  />
                  <Button className="w-full" onClick={copyPublishedUrl}>
                    Copy link
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleUnpublish}
                  >
                    Unpublish
                  </Button>
                </div>
              ) : (
                <Button onClick={handlePublish} className="w-full mt-4">
                  Publish
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full">
        <div className="mb-10 relative">
          {bannerUrl && (
            <img
              src={bannerUrl}
              alt="Note banner"
              className="w-full h-64 object-cover"
            />
          )}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <UploadBanner
              noteId={noteId}
              subpageId={isSubpage ? data.id : undefined}
              currentBanner={bannerUrl}
              onBannerUpdate={handleBannerUpdate}
            />
            {bannerUrl && (
              <Button variant="secondary" onClick={handleRemoveBanner}>
                <IoClose className="mr-2" size={18} />
                Remove Banner
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center mx-20 border-t border-b py-8 justify-between">
          <div className="flex items-center gap-8">
            <div className="relative">
              <span
                className="text-5xl cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {data.emoji}
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
                  {data.title}
                </h1>
              )}
            </div>
          </div>

          {!bannerUrl && (
            <UploadBanner
              noteId={noteId}
              subpageId={isSubpage ? data.id : undefined}
              currentBanner={bannerUrl}
              onBannerUpdate={handleBannerUpdate}
            />
          )}
        </div>
      </div>
      <div>
        <TextEditor
          noteId={noteId}
          subpageId={isSubpage ? data.id : undefined}
        />
      </div>
      {/* <div className="fixed bottom-5 md:ml-80 left-0 z-10">
        <GenerateAIContent />
      </div> */}
    </div>
  );
};

export default NotePageContent;
