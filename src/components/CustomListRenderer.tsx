import React from "react";

const CustomListRenderer = ({ data }: { data: any }) => {
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
};

export default CustomListRenderer;
