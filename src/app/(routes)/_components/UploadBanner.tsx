// UploadBanner.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { LucideUpload } from "lucide-react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase.config";

interface UploadBannerProps {
  noteId: string;
  subpageId?: string;
  currentBanner?: string | null;
  onBannerUpdate: (url: string) => void;
}

const UploadBanner: React.FC<UploadBannerProps> = ({
  noteId,
  subpageId,
  currentBanner,
  onBannerUpdate,
}) => {
  const [banner, setBanner] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBanner(file);

      // Preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (banner) {
      setUploading(true);

      // If there's an existing banner, delete it first
      if (currentBanner) {
        const oldBannerRef = ref(storage, currentBanner);
        try {
          await deleteObject(oldBannerRef);
        } catch (error) {
          console.error("Error deleting old banner:", error);
        }
      }

      const storageRef = ref(storage, `banners/${noteId}/${banner.name}`);
      const uploadTask = uploadBytesResumable(storageRef, banner);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(
            "Banner uploaded successfully, download URL:",
            downloadURL
          );

          // Update the note document with the new banner URL
          const noteDocRef = doc(db, "notes", noteId);

          if (subpageId) {
            // If it's a subpage, update the subpage's banner
            const noteDoc = await getDoc(noteDocRef);
            if (noteDoc.exists()) {
              const noteData = noteDoc.data();
              const updatedSubpages = noteData.subpages.map((sp: any) =>
                sp.id === subpageId ? { ...sp, banner: downloadURL } : sp
              );
              await updateDoc(noteDocRef, { subpages: updatedSubpages });
            }
          } else {
            // If it's the main note
            await updateDoc(noteDocRef, { banner: downloadURL });
          }

          // Call the onBannerUpdate callback with the new URL
          onBannerUpdate(downloadURL);

          // Reset the preview and state
          setBanner(null);
          setPreview(null);
          setUploading(false);
        }
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex lg:w-fit w-[90%] items-center">
          <LucideUpload size={15} className="mr-3" />
          <div className="hidden lg:block">
            {currentBanner ? "Update Banner" : "Upload Banner"}
          </div>
          <div className="block lg:hidden">
            {currentBanner ? "Update" : "Upload Banner"}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl lg:text-2xl font-bold">
            {currentBanner ? "Update Banner" : "Upload Banner"}
          </DialogTitle>
          <DialogDescription className="text-center">
            This banner will be displayed at the top of your note.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition duration-200 ease-in-out"
          >
            {preview ? (
              <img
                src={preview}
                alt="Banner Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG, or GIF (MAX. 800x400px)
                </p>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              onChange={handleBannerUpload}
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        {preview && (
          <div className="flex justify-center mt-4">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setPreview(null)}
            >
              Remove Image
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!banner || uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : currentBanner ? "Update" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadBanner;
