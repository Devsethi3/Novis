// /app/published/[noteId]/page.tsx

import React from "react";
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase.config";
import EditorJSParser from "editorjs-html"; // Import 

interface PublishedNoteProps {
  params: {
    noteId: string;
  };
}

interface NoteData {
  id: string;
  title: string;
  emoji: string;
  content: any; // content as a structured JSON object
  banner: string | null;
  isPublished: boolean;
  bannerUrl: string | null;
}

async function getPublishedNote(noteId: string): Promise<NoteData | null> {
  try {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);

    if (noteSnap.exists()) {
      const noteData = noteSnap.data() as Omit<NoteData, "id" | "bannerUrl">;

      if (!noteData.isPublished) {
        console.log("Note is not published");
        return null;
      }

      let bannerUrl: string | null = null;

      if (noteData.banner) {
        const bannerRef = ref(storage, noteData.banner);
        bannerUrl = await getDownloadURL(bannerRef);
      }

      return {
        ...noteData,
        id: noteSnap.id,
        bannerUrl,
      };
    } else {
      console.log("Note does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching published note:", error);
    return null;
  }
}

const PublishedNote: React.FC<PublishedNoteProps> = async ({ params }) => {
  const note = await getPublishedNote(params.noteId);

  if (!note) {
    return (
      <div className="text-center mt-10">Note not found or not published.</div>
    );
  }

  const editorJSParser = EditorJSParser(); // Create a new instance of the parser
  const htmlContent = editorJSParser.parse(note.content).join(""); // Convert Editor.js data to HTML

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl">{note.emoji}</span>
        <h1 className="text-4xl font-bold">{note.title}</h1>
      </div>
      {note.bannerUrl && (
        <img
          src={note.bannerUrl}
          alt="Note banner"
          className="w-full h-64 object-cover mb-6 rounded-lg"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />{" "}
    </div>
  );
};

export default PublishedNote;
