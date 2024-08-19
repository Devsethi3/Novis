import React from "react";
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase.config";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

const EditorOutput = dynamic(() => import("@/components/EditorOutput"), {
  ssr: false,
});

interface PublishedSubPageProps {
  params: {
    noteId: string;
    subpageId?: string;
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
  subpages?: Array<SubpageData>;
}

interface SubpageData {
  id: string;
  title: string;
  emoji: string;
  content: any;
  banner: string | null;
  isPublished: boolean;
  publishedUrl: string | null;
  bannerUrl: string | null;
}

async function getPublishedSubPage(
  noteId: string,
  subpageId?: string
): Promise<NoteData | null> {
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

      let subpageData: SubpageData | null = null;

      if (subpageId && noteData.subpages) {
        const subpage = noteData.subpages.find((sp) => sp.id === subpageId);

        if (subpage && subpage.isPublished) {
          let subpageBannerUrl: string | null = null;

          if (subpage.banner) {
            const bannerRef = ref(storage, subpage.banner);
            subpageBannerUrl = await getDownloadURL(bannerRef);
          }

          subpageData = {
            ...subpage,
            bannerUrl: subpageBannerUrl,
          };
        }
      }

      return {
        ...noteData,
        id: noteSnap.id,
        bannerUrl,
        ...(subpageData ? { subpages: [subpageData] } : {}),
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
  { params }: PublishedSubPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { noteId, subpageId } = params;
  const note = await getPublishedSubPage(noteId, subpageId);

  if (!note) {
    return {
      title: "Page Not Found",
    };
  }

  const subpage = note.subpages?.[0];
  const pageTitle = subpage ? subpage.title : note.title;
  const pageEmoji = subpage ? subpage.emoji : note.emoji;
  const pageBannerUrl = subpage ? subpage.bannerUrl : note.bannerUrl;

  // Create a base64-encoded favicon using the emoji
  const faviconUrl = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><text y=%22.9em%22 font-size=%2232%22>${pageEmoji}</text></svg>`;

  return {
    title: pageTitle,
    description: `${pageEmoji} ${pageTitle}`,
    openGraph: {
      title: pageTitle,
      description: `${pageEmoji} ${pageTitle}`,
      images: pageBannerUrl ? [pageBannerUrl] : [],
    },
    icons: {
      icon: faviconUrl,
    },
  };
}


const PublishedSubPage: React.FC<PublishedSubPageProps> = async ({
  params,
}) => {
  const { noteId, subpageId } = params;
  const note = await getPublishedSubPage(noteId, subpageId);

  if (!note) {
    return (
      <div className="text-center mt-10">Page not found or not published.</div>
    );
  }

  const subpage = note.subpages?.[0];
  const content = subpage ? subpage.content : note.content;
  const title = subpage ? subpage.title : note.title;
  const emoji = subpage ? subpage.emoji : note.emoji;
  const bannerUrl = subpage ? subpage.bannerUrl : note.bannerUrl;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <span className="text-4xl sm:text-5xl">{emoji}</span>
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt="Note banner"
          className="w-full h-40 sm:h-56 md:h-64 object-cover mb-4 sm:mb-6 rounded-lg"
        />
      )}
      <EditorOutput content={content} />
    </div>
  );
};

export default PublishedSubPage;
