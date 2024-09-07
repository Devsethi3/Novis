"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useAuth from "@/lib/useAuth";
import { auth, db, storage } from "@/lib/firebase.config";
import { signOut, updateProfile, User } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LucideLoader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
}

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onOpenChange,
  trigger,
}) => {
  const { currentUser: initialFirestoreUser, loading } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState<UserData | null>(
    initialFirestoreUser
  );
  const [authUser, setAuthUser] = useState<User | null>(auth.currentUser);
  const [newDisplayName, setNewDisplayName] = useState(
    firestoreUser?.displayName || ""
  );
  const [newPhotoURL, setNewPhotoURL] = useState(firestoreUser?.photoURL || "");
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingProfileUpdate, setLoadingProfileUpdate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialFirestoreUser) {
      const unsubscribe = onSnapshot(
        doc(db, "users", initialFirestoreUser.uid),
        (doc) => {
          if (doc.exists()) {
            setFirestoreUser(doc.data() as UserData);
            setNewDisplayName(doc.data().displayName || "");
            setNewPhotoURL(doc.data().photoURL || "");
          }
        }
      );

      return () => unsubscribe();
    }
  }, [initialFirestoreUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhotoFile(e.target.files[0]);
      setNewPhotoURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateProfile = async () => {
    if (!newDisplayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoadingProfileUpdate(true);
    try {
      if (!authUser) return;

      let photoURL = newPhotoURL;

      if (newPhotoFile) {
        const storageRef = ref(storage, `profilePictures/${authUser.uid}`);
        await uploadBytes(storageRef, newPhotoFile);
        photoURL = await getDownloadURL(storageRef);
      }

          
      await updateProfile(authUser, {
        displayName: newDisplayName,
        photoURL: photoURL,
      });

      // Update Firestore user document
      const userRef = doc(db, "users", authUser.uid);
      await updateDoc(userRef, {
        displayName: newDisplayName,
        photoURL: photoURL,
      });

      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoadingProfileUpdate(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center w-full justify-center">
        <LucideLoader className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Settings Dialog */}
      {trigger}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Update Your Profile
            </DialogTitle>
            <p className="text-sm mt-1">
              Make changes to your profile information, including your name and
              profile picture.
            </p>
          </DialogHeader>
          <AnimatePresence>
            <motion.div
              className="grid gap-4 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name :
                </label>
                <Input
                  id="name"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="col-span-3 border border-accent rounded-md"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Photo</label>
                <div className="col-span-3 flex items-center gap-4">
                  <Image
                    src={newPhotoURL || "/placeholder.jpg"}
                    alt="Profile"
                    width={45}
                    height={45}
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Change
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button
              className="mb-2 lg:mb-0"
              onClick={handleUpdateProfile}
              disabled={loadingProfileUpdate}
            >
              {loadingProfileUpdate ? (
                <>
                  Saving...
                  <LucideLoader className="h-5 w-5 animate-spin" />
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsModal;
