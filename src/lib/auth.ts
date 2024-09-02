import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase.config";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      throw new Error("Email already exists.");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the Firebase user profile
    await updateProfile(user, { displayName: name });

    // Set user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: name || "Anonymous User",
      photoURL:
        "https://c39b6ba002.imgdist.com/public/users/BeeFree/beefree-023dabaf-f906-465c-aaeb-36b492929559/placeholder.jpg", // Default profile picture
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Set user data in Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Anonymous User",
        photoURL: user.photoURL, // Use Google's profile picture
        createdAt: new Date(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    // Set user data in Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Anonymous User",
        photoURL: user.photoURL, // Use GitHub's profile picture
        createdAt: new Date(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};
