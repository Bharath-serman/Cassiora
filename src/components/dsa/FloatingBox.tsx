
import React from "react";

interface FloatingBoxProps {
  children: React.ReactNode;
  from?: "left" | "right" | "up" | "down";
  floating?: boolean;
  duration?: number; // ms
  style?: React.CSSProperties;
  className?: string;
}

const getStartTranslation = (from: string) => {
  switch (from) {
    case "left":
      return "translateX(-60px)";
    case "right":
      return "translateX(60px)";
    case "up":
      return "translateY(-60px)";
    case "down":
      return "translateY(60px)";
    default:
      return "none";
  }
};

export default function FloatingBox({
  children,
  from = "up",
  floating = false,
  duration = 850,
  style,
  className = "",
}: FloatingBoxProps) {
  return (
    <div
      className={`${className} transition-all`}
      style={{
        opacity: floating ? 1 : 0,
        transform: floating ? "translateX(0) translateY(0)" : getStartTranslation(from),
        transition: `opacity ${duration}ms cubic-bezier(.4,0,.2,1), transform ${duration}ms cubic-bezier(.4,0,.2,1)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
