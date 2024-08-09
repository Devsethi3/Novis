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

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
}

const SettingsPage = () => {
  const { currentUser: initialFirestoreUser, loading } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState<UserData | null>(
    initialFirestoreUser
  );
  const [authUser, setAuthUser] = useState<User | null>(auth.currentUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(
    firestoreUser?.displayName || ""
  );
  const [newPhotoURL, setNewPhotoURL] = useState(firestoreUser?.photoURL || "");
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    try {
      if (!authUser) return;

      let photoURL = newPhotoURL;

      if (newPhotoFile) {
        const storageRef = ref(storage, `profilePictures/${authUser.uid}`);
        await uploadBytes(storageRef, newPhotoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Auth profile
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
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center w-full justify-center">
    <LucideLoader className="h-12 w-12 animate-spin" />
  </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="shadow-lg border rounded-lg p-8 w-full max-w-md">
        {firestoreUser ? (
          <div className="text-center">
            <img
              src={firestoreUser.photoURL || "/placeholder.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">
              {firestoreUser.displayName || "Anonymous User"}
            </h2>
            <p className="text-gray-600">{firestoreUser.email}</p>

            <div className="mt-6 space-x-4">
              <Button
                onClick={handleSignOut}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Sign Out
              </Button>
              <Button onClick={() => setIsDialogOpen(true)}>Settings</Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">No user is signed in.</p>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Photo</label>
              <div className="col-span-3 flex items-center gap-4">
                <Image
                  src={newPhotoURL || "/placeholder.jpg"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover"
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
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
