import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-ivory border border-blush-300 rounded-[24px] p-8 sm:p-10",
          "shadow-[0_20px_50px_-30px_rgba(122,46,69,0.25)]",
          hoverable &&
            "transition-all duration-300 ease-out hover:shadow-[0_26px_56px_-24px_rgba(122,46,69,0.3)] hover:border-rose-400/80",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
