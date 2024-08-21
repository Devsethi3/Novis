import React from "react";

const CustomAlertRenderer = ({ data }: { data: any }) => {
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
};

export default CustomAlertRenderer;
