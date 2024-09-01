import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className: string;
  colors: string[];
  animationSpeed: number;
  showBorder: boolean;
  onClick: () => void;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"], // Default colors
  animationSpeed = 8, // Default animation speed in seconds
  showBorder = false, // Default overlay visibility
  onClick,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`, // This will be applied directly to the style
  };

  return (
    <div
      onClick={onClick}
      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-lg font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${className}`}
    >
      {showBorder && (
        <div
          className="absolute inset-0 bg-cover z-0 pointer-events-none animate-gradient"
          style={{
            ...gradientStyle,
            backgroundSize: "300% 100%",
            // Direct animation style will override Tailwind animation duration
          }}
        >
          <div
            className="absolute inset-0 bg-black rounded-lg z-[-1]"
            style={{
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
      )}
      <div
        className="inline-block relative z-2 text-sm text-transparent bg-cover animate-gradient"
        style={{
          ...gradientStyle,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundSize: "300% 100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
