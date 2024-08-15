"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";

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
import Alert from 'editorjs-alert';

const TextEditor: React.FC = () => {
const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const initEditor = async () => {
      if (!editorRef.current) {
        const editor = new EditorJS({
          holder: "editorjs",
          placeholder: "Type here to write your note...",
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
              shortcut: 'CMD+SHIFT+A',
              config: {
                alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
                defaultType: 'primary',
                messagePlaceholder: 'Enter something',
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
                  byUrl: "http://localhost:3000/fetchUrl",
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

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null; // Reset the reference to ensure it's cleaned up
      }
    };
  }, []);

  return (
    <div className="px-20 -ml-[400px] py-4">
      <div id="editorjs"></div>
    </div>
  );
};

export default TextEditor;
