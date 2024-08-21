import React, { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FiCopy, FiCheck } from "react-icons/fi";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CodeRendererProps {
  data: {
    code: string;
    language: string;
  };
}

const CustomCodeRenderer = ({ data }: CodeRendererProps) => {
  const [copied, setCopied] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (copied) {
      setShowCheckmark(true);
      timeout = setTimeout(() => {
        setShowCheckmark(false);
        setCopied(false);
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [copied]);

  return (
    <div className="relative my-4">
      <CopyToClipboard text={data.code} onCopy={() => setCopied(true)}>
        <button
          className={`absolute top-2 right-2 p-2 rounded-md transition-transform bg-gray-800 hover:bg-gray-700 focus:outline-none text-gray-300`}
          aria-label="Copy to clipboard"
          style={{ transition: "transform 0.2s" }}
        >
          {showCheckmark ? (
            <FiCheck size={20} className="text-white" />
          ) : (
            <FiCopy size={20} />
          )}
        </button>
      </CopyToClipboard>

      <div
        className={`absolute top-4 right-14 text-sm text-gray-400 transition-opacity ${
          copied ? "opacity-100" : "opacity-0"
        }`}
        style={{ transition: "opacity 0.5s" }}
      >
        Copied!
      </div>

      <SyntaxHighlighter
        language={data.language || "javascript"}
        style={atomOneDark}
        showLineNumbers={true}
        wrapLines={true}
        PreTag="div"
      >
        {data.code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CustomCodeRenderer;

