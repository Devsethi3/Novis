import React from "react";
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase.config";
import EditorJSParser from "editorjs-html";
import { Metadata, ResolvingMetadata } from "next";

interface PublishedNoteProps {
  params: {
    noteId: string;
  };
}

interface NoteData {
  id: string;
  title: string;
  emoji: string;
  content: any;
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
      return null;
    }
  } catch (error) {
    console.error("Error fetching published note:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: PublishedNoteProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const note = await getPublishedNote(params.noteId);

  if (!note) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: note.title,
    description: `${note.emoji} ${note.title}`,
    openGraph: {
      title: note.title,
      description: `${note.emoji} ${note.title}`,
      images: note.bannerUrl ? [note.bannerUrl] : [],
    },
  };
}

const PublishedNote: React.FC<PublishedNoteProps> = async ({ params }) => {
  const note = await getPublishedNote(params.noteId);

  if (!note) {
    return (
      <div className="text-center mt-10">Page not found or not published.</div>
    );
  }

  const editorJSParser = EditorJSParser();
  const htmlContent = editorJSParser.parse(note.content).join("");

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
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default PublishedNote;
