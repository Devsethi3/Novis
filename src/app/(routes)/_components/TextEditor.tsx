"use client";

import { useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";

// Import tools
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

type EditorJS = /*unresolved*/ any;

const TextEditor: React.FC = () => {
  const editorRef = useRef<EditorJS | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (!isEditorReady) {
      initEditor().then(() => {
        setIsEditorReady(true);
      });
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isEditorReady]);

  const initEditor = async () => {
    if (editorRef.current) return;

    const EditorJS = (await import("@editorjs/editorjs")).default;
    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Let's write an awesome story!",
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
            endpoints: {
              byFile: "http://localhost:8008/uploadFile",
              byUrl: "http://localhost:8008/fetchUrl",
            },
          },
        },
        code: Code,
        linkTool: LinkTool,
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

    await editor.isReady;
    editorRef.current = editor;
  };

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();
        console.log("Article data: ", outputData);
        // Here you can send the data to your Firebase backend
      } catch (error) {
        console.error("Saving failed: ", error);
      }
    }
  };

  return (
    <div className="px-20 py-4">
      <div id="editorjs" className="min-h-[300px]"></div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TextEditor;