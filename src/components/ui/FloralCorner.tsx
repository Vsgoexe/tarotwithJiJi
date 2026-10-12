import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface FloralCornerProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  size?: number;
  opacity?: number;
}

export const FloralCorner: React.FC<FloralCornerProps> = ({
  position = "top-left",
  className,
  size = 280,
  opacity = 0.8,
}) => {
  const positionClasses = {
    "top-left": "top-0 left-0 -translate-x-1/6 -translate-y-1/6",
    "top-right": "top-0 right-0 translate-x-1/6 -translate-y-1/6 scale-x-[-1]",
    "bottom-left": "bottom-0 left-0 -translate-x-1/6 translate-y-1/6 scale-y-[-1]",
    "bottom-right": "bottom-0 right-0 translate-x-1/6 translate-y-1/6 scale-[-1]",
  };

  const imageSrc =
    position === "top-left" || position === "bottom-left"
      ? "/images/corner-top-left.svg"
      : "/images/corner-bottom-right.svg";

  return (
    <div
      className={cn(
        "absolute pointer-events-none select-none z-0 overflow-hidden mix-blend-multiply",
        positionClasses[position],
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      <Image
        src={imageSrc}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className="w-auto h-auto max-w-[200px] sm:max-w-[280px] lg:max-w-[340px]"
      />
    </div>
  );
};
