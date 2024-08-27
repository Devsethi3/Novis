import React from "react";
import { cn } from "@/lib/utils";

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
                  className="px-4 py-2 border border-border bg-secondary text-left text-secondary-foreground font-semibold"
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
                className={cn(
                  "transition-colors",
                  rowIndex % 2 === 0 ? "bg-background" : "bg-muted/40"
                )}
              >
                {row.map((cell: string, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="border border-border px-4 py-2 text-left text-foreground"
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
