"use client";

import React, { useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase.config";
import GenerateAIContent from "./GenerateAIContent";

// Import all your EditorJS tools here
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Raw from "@editorjs/raw";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import Table from "@editorjs/table";
import Alert from "editorjs-alert";

interface TextEditorProps {
  noteId: string;
  subpageId?: string;
}

type OutputData = /*unresolved*/ any;
type EditorJS = /*unresolved*/ any;

const TextEditor: React.FC<TextEditorProps> = ({ noteId, subpageId }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const [initialData, setInitialData] = useState<OutputData | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const noteDocRef = doc(db, "notes", noteId);
      const noteSnapshot = await getDoc(noteDocRef);

      if (noteSnapshot.exists()) {
        const noteData = noteSnapshot.data();
        let content;
        if (subpageId) {
          const subpage = noteData.subpages.find(
            (sp: any) => sp.id === subpageId
          );
          content = subpage?.content;
        } else {
          content = noteData.content;
        }

        try {
          if (typeof content === "string") {
            setInitialData(JSON.parse(content));
          } else {
            setInitialData(content || {});
          }
        } catch (error) {
          console.error("Error parsing initial data:", error);
          setInitialData(content || {});
        }
      }
    };

    fetchInitialData();
  }, [noteId, subpageId]);

  const processContent = (content: OutputData): OutputData => {
    return {
      ...content,
      // @ts-ignore
      blocks: content.blocks.map((block) => {
        if (block.type === "header") {
          return {
            ...block,
            data: {
              ...block.data,
              text: block.data.text.replace(/^#+\s*/, ""),
            },
          };
        }
        if (block.type === "paragraph") {
          return {
            ...block,
            data: {
              ...block.data,
              text: block.data.text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
            },
          };
        }
        if (block.type === "table") {
          return {
            ...block,
            data: {
              ...block.data,
              content: block.data.content.map((row: string[]) =>
                row.map((cell) => cell.trim())
              ),
            },
          };
        }
        return block;
      }),
    };
  };

  const saveDocument = async () => {
    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();
        const processedData = processContent(outputData);

        if (subpageId) {
          const noteDocRef = doc(db, "notes", noteId);
          const noteSnapshot = await getDoc(noteDocRef);
          if (noteSnapshot.exists()) {
            const noteData = noteSnapshot.data();
            const updatedSubpages = noteData.subpages.map((sp: any) =>
              sp.id === subpageId
                ? { ...sp, content: JSON.stringify(processedData) }
                : sp
            );
            await updateDoc(noteDocRef, { subpages: updatedSubpages });
          }
        } else {
          const noteDocRef = doc(db, "notes", noteId);
          await updateDoc(noteDocRef, {
            content: JSON.stringify(processedData),
          });
        }
      } catch (error) {
        console.error("Error saving document:", error);
      }
    } else {
      console.error("Editor instance is not initialized.");
    }
  };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `images/${noteId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const initializeEditor = (data: OutputData) => {
    if (editorRef.current) {
      editorRef.current.destroy();
    }

    editorRef.current = new EditorJS({
      holder: "editorjs",
      data: data,
      placeholder: "Type here to write your note...",
      onChange: () => {
        if (editorRef.current) {
          saveDocument();
        }
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["marker", "link"],
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4],
            defaultLevel: 3,
          },
        },
        alert: Alert,
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                const url = await uploadImageToFirebase(file);
                return {
                  success: 1,
                  file: {
                    url,
                  },
                };
              },
            },
          },
        },
        code: Code,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "/api/link",
          },
        },
        raw: Raw,
        embed: Embed,
        quote: Quote,
        marker: Marker,
        checklist: CheckList,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        table: Table,
      },
    });
  };

  useEffect(() => {
    if (initialData) {
      initializeEditor(initialData);
    }

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialData]);

  const handleAIContentGenerated = (content: OutputData) => {
    const processedContent = processContent(content);
    if (editorRef.current) {
      editorRef.current.render(processedContent);
    } else {
      initializeEditor(processedContent);
    }
  };

  return (
    <div className="px-20 py-4">
      <div className="fixed bottom-5 md:ml-80 left-0 z-10">
        <GenerateAIContent onContentGenerated={handleAIContentGenerated} />
      </div>
      <div id="editorjs"></div>
    </div>
  );
};

export default TextEditor;
