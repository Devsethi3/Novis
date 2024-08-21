"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";

// Dynamically import the editorjs-react-renderer without SSR
const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

interface EditorOutputProps {
  content: any;
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
  embed: CustomEmbedRenderer,
  list: CustomListRenderer,
  table: CustomTableRenderer,
  alert: CustomAlertRenderer,
};

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  header: {
    h1: {
      fontSize: "1.875rem",
      fontWeight: "600",
      lineHeight: "2.25rem",
      marginTop: "1.5rem",
      marginBottom: "1rem",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: "600",
      lineHeight: "2rem",
      marginTop: "1.5rem",
      marginBottom: "0.75rem",
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: "600",
      lineHeight: "1.75rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
    },
    h4: {
      fontSize: "1.125rem",
      fontWeight: "600",
      lineHeight: "1.5rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
    },
    h5: {
      fontSize: "1rem",
      fontWeight: "600",
      lineHeight: "1.5rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.25rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
    },
  },
  list: {
    container: { marginLeft: "1.25rem", marginBottom: "0.5rem" },
    listItem: { marginBottom: "0.25rem" },
  },
  quote: {
    container: {
      fontStyle: "italic",
      marginBlock: "2rem",
      padding: "1rem 1.5rem",
      borderRadius: "4px",
    },
    content: {
      fontSize:
        "1.125rem" /* Slightly larger font size for better readability */,
      lineHeight: "1.75rem" /* Increased line height for better readability */,
    },
  },
  table: {
    table: { borderCollapse: "collapse", width: "100%", marginBottom: "1rem" },
    tableCell: { border: "1px solid #e2e8f0", padding: "0.5rem" },
    tableHeader: { backgroundColor: "#f7fafc", fontWeight: "600" },
  },
};

function CustomListRenderer({ data }: any) {
  const listType = data.style === "ordered" ? "ol" : "ul";
  const ListTag = listType as keyof JSX.IntrinsicElements;

  // Function to remove HTML tags from a string
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <ListTag className="list-inside my-4 ml-4">
      {data.items.map((item: string, index: number) => (
        <li key={index} className="mb-2">
          {listType === "ol" ? `${index + 1}. ` : "• "}
          {stripHtml(item)}
        </li>
      ))}
    </ListTag>
  );
}

function CustomTableRenderer({ data }: any) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse">
        <thead>
          {data.withHeadings && (
            <tr>
              {data.content[0].map((heading: string, index: number) => (
                <th
                  key={index}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-300 font-semibold"
                >
                  {heading}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {data.content
            .slice(data.withHeadings ? 1 : 0)
            .map((row: string[], rowIndex: number) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-900"
                }
              >
                {row.map((cell: string, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-700 dark:text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomImageRenderer({ data }: any) {
  const src = data.file?.url || data.url;
  const caption = data.caption || "";
  const stretched = data.stretched || false;
  const withBackground = data.withBackground || false;
  const withBorder = data.withBorder || false;

  let imageClasses = "max-w-full h-auto my-4";
  let containerClasses = "relative";

  if (stretched) {
    containerClasses += " w-full";
  } else {
    containerClasses += " max-w-2xl mx-auto";
  }

  if (withBackground) {
    containerClasses += " bg-gray-100 p-4";
  }

  if (withBorder) {
    imageClasses += " border border-gray-300";
  }

  return (
    <figure className={containerClasses}>
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {" "}
        {/* 16:9 aspect ratio */}
        <Image
          src={src}
          alt={caption}
          layout="fill"
          objectFit="contain"
          className={imageClasses}
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4 my-4 overflow-x-auto">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}

function CustomEmbedRenderer({ data }: any) {
  if (!data.embed) return null;

  return (
    <div className="embed-container my-4">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {" "}
        {/* 16:9 aspect ratio */}
        <iframe
          src={data.embed}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {data.caption && (
        <p className="text-center text-sm text-gray-500 mt-2">{data.caption}</p>
      )}
    </div>
  );
}

function CustomAlertRenderer({ data }: any) {
  const type = data.type || "info";
  const alignment = data.align || "left";

  const typeToColor = {
    primary: "bg-blue-100 border-blue-500 text-blue-700",
    secondary: "bg-gray-100 border-gray-500 text-gray-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
    success: "bg-green-100 border-green-500 text-green-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    danger: "bg-red-100 border-red-500 text-red-700",
    light: "bg-gray-50 border-gray-300 text-gray-800",
    dark: "bg-gray-800 border-gray-900 text-gray-100",
  };

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={`border rounded-md p-3 my-4 ${
        typeToColor[type as keyof typeof typeToColor]
      } ${alignmentClasses[alignment as keyof typeof alignmentClasses]}`}
    >
      <p className="m-0">{data.message}</p>
    </div>
  );
}

const EditorOutput: React.FC<EditorOutputProps> = ({ content }) => {
  let parsedContent;
  try {
    parsedContent = typeof content === "string" ? JSON.parse(content) : content;
  } catch (error) {
    console.error("Error parsing content:", error);
    return <div>Invalid content format</div>;
  }

  // Check if the content has blocks
  if (!parsedContent || !parsedContent.blocks) {
    return <div>No content to display</div>;
  }

  return (
    <Output
      data={parsedContent}
      style={style}
      className="text-sm"
      renderers={renderers}
    />
  );
};

export default EditorOutput;
