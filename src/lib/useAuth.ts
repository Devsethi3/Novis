// useAuth.ts

import { useEffect, useState } from "react";
import { auth, db } from "./firebase.config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
}

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set up real-time listener for Firestore user document
        unsubscribeFirestore = onSnapshot(
          doc(db, "users", user.uid),
          (doc) => {
            if (doc.exists()) {
              setCurrentUser(doc.data() as UserData);
            } else {
              console.error("No such user document!");
              setCurrentUser(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user data:", error);
            setLoading(false);
          }
        );
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null); // Clear user state on logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { currentUser, handleLogout, loading };
};

export default useAuth;
