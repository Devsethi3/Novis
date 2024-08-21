import React, { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FiCopy, FiCheck } from "react-icons/fi";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeRendererProps {
  data: {
    code: string;
    language: string;
  };
}

const CustomCodeRenderer = ({ data }: CodeRendererProps) => {
  const [copied, setCopied] = useState(false);
  SyntaxHighlighter.supportedLanguages;
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (copied) {
      setShowCheckmark(true);
      timeout = setTimeout(() => {
        setShowCheckmark(false);
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
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 focus:outline-none"
          aria-label="Copy to clipboard"
        >
          {showCheckmark ? (
            <FiCheck size={20} className="text-green-500" />
          ) : (
            <FiCopy size={20} />
          )}
        </button>
      </CopyToClipboard>

      {copied && (
        <div className="absolute top-2 right-8 text-xs text-green-500">
          Copied!
        </div>
      )}

      <SyntaxHighlighter
        language={data.language || "javascript"}
        style={atomOneDark}
        // customStyle={{
        //   backgroundColor: "#303030",
        //   color: "#d4d4d4",
        //   fontFamily: "Menlo, Monaco, 'Courier New', monospace",
        //   padding: "1rem",
        //   borderRadius: "0.25rem",
        //   overflowX: "auto",
        // }}
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
