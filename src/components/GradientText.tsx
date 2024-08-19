import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  theme?: "light" | "dark"; // New prop for theme
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = "",
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"], // Default colors
  animationSpeed = 8, // Default animation speed in seconds
  showBorder = false, // Default overlay visibility
  theme = "light", // Default theme is light
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  const themeBackground = theme === "dark" ? "#2E2E2E" : "#FFFFFF"; // Background based on theme
  const themeColor = theme === "dark" ? "#FFFFFF" : "#000000"; // Text color based on theme

  return (
    <div
      className={`animated-gradient-text ${className}`}
      style={{
        backgroundColor: themeBackground, // Apply theme background
        color: themeColor, // Apply theme text color
        padding: "0.5rem 1rem", // Padding for better appearance
        borderRadius: "0.5rem", // Rounded corners
      }}
    >
      {showBorder && (
        <div className="gradient-overlay" style={gradientStyle}></div>
      )}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
};

export default GradientText;
