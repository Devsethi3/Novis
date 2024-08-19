"use client";

import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase.config";

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

type EditorJS = /* unresolved */ any;

const TextEditor: React.FC<TextEditorProps> = ({ noteId, subpageId }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const [initialData, setInitialData] = useState<any | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const noteDocRef = doc(db, "notes", noteId);
      const noteSnapshot = await getDoc(noteDocRef);

      if (noteSnapshot.exists()) {
        const noteData = noteSnapshot.data();
        if (subpageId) {
          const subpage = noteData.subpages.find(
            (sp: any) => sp.id === subpageId
          );
          setInitialData(subpage?.content || {});
        } else {
          setInitialData(noteData.content || {});
        }
      }
    };

    fetchInitialData();
  }, [noteId, subpageId]);

  const flattenTableData = (data: any) => {
    if (Array.isArray(data)) {
      return data.map((row: any) => (Array.isArray(row) ? row.join(",") : row));
    }
    return data;
  };

  const saveDocument = async (outputData: any) => {
    const noteDocRef = doc(db, "notes", noteId);

    // Flatten any nested arrays, especially in table blocks
    const processedData = {
      ...outputData,
      blocks: outputData.blocks.map((block: any) => {
        if (block.type === "table") {
          return {
            ...block,
            data: {
              content: flattenTableData(block.data.content),
            },
          };
        }
        return block;
      }),
    };

    if (subpageId) {
      const noteSnapshot = await getDoc(noteDocRef);
      if (noteSnapshot.exists()) {
        const noteData = noteSnapshot.data();
        const updatedSubpages = noteData.subpages.map((sp: any) =>
          sp.id === subpageId ? { ...sp, content: processedData } : sp
        );
        await updateDoc(noteDocRef, { subpages: updatedSubpages });
      }
    } else {
      await updateDoc(noteDocRef, { content: processedData });
    }
  };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `images/${noteId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  useEffect(() => {
    if (initialData) {
      const initEditor = async () => {
        if (!editorRef.current) {
          const editor = new EditorJS({
            holder: "editorjs",
            data: initialData,
            placeholder: "Type here to write your note...",
            onChange: (api: any, event: CustomEvent) => {
              api.saver.save().then((outputData: any) => {
                saveDocument(outputData);
              });
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
              alert: {
                class: Alert,
                inlineToolbar: true,
                shortcut: "CMD+SHIFT+A",
                config: {
                  alertTypes: [
                    "primary",
                    "secondary",
                    "info",
                    "success",
                    "warning",
                    "danger",
                    "light",
                    "dark",
                  ],
                  defaultType: "primary",
                  messagePlaceholder: "Enter something",
                },
              },
              list: {
                class: List,
                inlineToolbar: true,
                config: {
                  defaultStyle: "unordered",
                },
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

          editorRef.current = editor;
        }
      };

      initEditor();
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

  return (
    <div className="px-20 py-4">
      <div id="editorjs"></div>
    </div>
  );
};

export default TextEditor;
