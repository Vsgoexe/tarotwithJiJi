import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PolaroidFrameProps {
  src: string;
  alt: string;
  caption?: string;
  captionScript?: boolean;
  rotation?: number; // degrees, e.g. -2, 1.5, 3
  width?: number;
  height?: number;
  className?: string;
}

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  src,
  alt,
  caption,
  captionScript = true,
  rotation = -2,
  width = 380,
  height = 380,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-block bg-ivory p-3.5 sm:p-4 pb-10 sm:pb-12",
        "border border-blush-300/80 rounded-[4px]",
        "shadow-[0_16px_36px_-16px_rgba(58,42,46,0.22),0_4px_10px_-2px_rgba(58,42,46,0.06)]",
        "transition-transform duration-500 ease-out hover:scale-[1.02]",
        className
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="relative overflow-hidden bg-blush-100 rounded-[2px] aspect-square">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
        />
      </div>
      {caption && (
        <div className="mt-3.5 text-center">
          <p
            className={cn(
              captionScript
                ? "font-script text-xl sm:text-2xl text-wine-600"
                : "font-serif text-sm tracking-widest uppercase text-ink-soft"
            )}
          >
            {caption}
          </p>
        </div>
      )}
    </div>
  );
};
