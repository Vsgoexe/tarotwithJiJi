import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
