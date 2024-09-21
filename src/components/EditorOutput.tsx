"use client";

import dynamic from "next/dynamic";
import CustomCodeRenderer from "./CustomCodeRenderer";
import CustomTableRenderer from "./CustomTableRenderer";
import CustomAlertRenderer from "./CustomAlertRenderer";
import CustomImageRenderer from "./CustomImageRenderer";
import CustomListRenderer from "./CustomListRenderer";
import style from "@/lib/style";

// Dynamically import the editorjs-react-renderer without SSR
const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

interface EditorOutputProps {
  content: any;
}

function CustomDelimiterRenderer() {
  return (
    <div className="delimiter-container my-6 flex justify-center">
      {/* <span className="text-2xl">★ ★ ★</span> */}
      <span className="text-5xl opacity-75">* * *</span>
    </div>
  );
}
function CustomEmbedRenderer({ data }: any) {
  if (!data.embed) return null;

  return (
    <div className="embed-container my-4">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
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

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
  embed: CustomEmbedRenderer,
  list: CustomListRenderer,
  table: CustomTableRenderer,
  alert: CustomAlertRenderer,
  delimiter: CustomDelimiterRenderer,
};

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
