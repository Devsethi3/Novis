import React from "react";

const CustomTableRenderer = ({ data }: { data: any }) => {
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
};

export default CustomTableRenderer;
