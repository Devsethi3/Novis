import React from "react";
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase.config";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

const EditorOutput = dynamic(() => import("@/components/EditorOutput"), {
  ssr: false,
});
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

export async function generateMetadata({
  params,
}: PublishedNoteProps): Promise<Metadata> {
  const note = await getPublishedNote(params.noteId);

  if (!note) {
    return {
      title: "Page Not Found",
    };
  }
  // Create a base64-encoded favicon using the emoji
  const faviconUrl = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%2232%22 height=%2232%22><text x=%2250%25%22 y=%2265%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2230%22>${note.emoji}</text></svg>`;

  return {
    title: note.title,
    description: `${note.emoji} ${note.title}`,
    openGraph: {
      title: note.title,
      description: `${note.emoji} ${note.title}`,
      images: note.bannerUrl ? [note.bannerUrl] : [],
    },
    icons: {
      icon: faviconUrl,
    },
  };
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}

const PublishedNote: React.FC<PublishedNoteProps> = async ({ params }) => {
  const note = await getPublishedNote(params.noteId);

  if (!note) {
    return (
      <div className="text-center mt-10">Page not found or not published.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <span className="text-4xl sm:text-5xl">{note.emoji}</span>
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold">
          {note.title}
        </h1>
      </div>
      {note.bannerUrl && (
        <img
          src={note.bannerUrl}
          alt="Note banner"
          className="w-full h-40 sm:h-56 md:h-64 object-cover mb-4 sm:mb-6 rounded-lg"
        />
      )}
      <EditorOutput content={note.content} />
    </div>
  );
};

export default PublishedNote;
