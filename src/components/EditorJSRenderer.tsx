import React from "react";

const EditorJSRenderer = ({ blocks }: { blocks: any[] }) => {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "header":
            return <h2 key={index}>{block.data.text}</h2>;
          case "paragraph":
            return <p key={index}>{block.data.text}</p>;
          case "list":
            return (
              <ul key={index}>
                {block.data.items.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            );
          case "alert":
            return (
              <div key={index} className="alert">
                {block.data.text}
              </div>
            );
          // Add more cases here based on the blocks you use in Editor.js
          default:
            return null;
        }
      })}
    </>
  );
};

export default EditorJSRenderer;