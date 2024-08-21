"use client";

import dynamic from "next/dynamic";
import CustomCodeRenderer from "./CustomCodeRenderer";
import CustomTableRenderer from "./CustomTableRenderer";
import CustomAlertRenderer from "./CustomAlertRenderer";
import CustomImageRenderer from "./CustomImageRenderer";
import CustomListRenderer from "./CustomListRenderer";

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
    "@media (min-width: 640px)": {
      fontSize: "1rem",
      lineHeight: "1.5rem",
    },
    "@media (min-width: 768px)": {
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
    },
  },
  header: {
    h1: {
      fontSize: "1.5rem",
      fontWeight: "600",
      lineHeight: "2rem",
      marginTop: "1.5rem",
      marginBottom: "1rem",
      "@media (min-width: 640px)": {
        fontSize: "1.875rem",
        lineHeight: "2.25rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "2.25rem",
        lineHeight: "2.5rem",
      },
    },
    h2: {
      fontSize: "1.25rem",
      fontWeight: "600",
      lineHeight: "1.75rem",
      marginTop: "1.5rem",
      marginBottom: "0.75rem",
      "@media (min-width: 640px)": {
        fontSize: "1.5rem",
        lineHeight: "2rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.875rem",
        lineHeight: "2.25rem",
      },
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: "600",
      lineHeight: "1.5rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      "@media (min-width: 640px)": {
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.5rem",
        lineHeight: "2rem",
      },
    },
    h4: {
      fontSize: "1rem",
      fontWeight: "600",
      lineHeight: "1.5rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      "@media (min-width: 640px)": {
        fontSize: "1.125rem",
        lineHeight: "1.75rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      },
    },
    h5: {
      fontSize: "0.9375rem",
      fontWeight: "600",
      lineHeight: "1.5rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      "@media (min-width: 640px)": {
        fontSize: "1rem",
        lineHeight: "1.5rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.125rem",
        lineHeight: "1.5rem",
      },
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.25rem",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      "@media (min-width: 640px)": {
        fontSize: "0.9375rem",
        lineHeight: "1.25rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1rem",
        lineHeight: "1.5rem",
      },
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
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
      "@media (min-width: 640px)": {
        fontSize: "1.25rem",
        lineHeight: "2rem",
      },
      "@media (min-width: 768px)": {
        fontSize: "1.5rem",
        lineHeight: "2.25rem",
      },
    },
  },
  table: {
    table: { borderCollapse: "collapse", width: "100%", marginBottom: "1rem" },
    tableCell: { border: "1px solid #e2e8f0", padding: "0.5rem" },
    tableHeader: { backgroundColor: "#f7fafc", fontWeight: "600" },
  },
};

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
