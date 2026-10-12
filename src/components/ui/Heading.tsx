import React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  size?: "display" | "h1" | "h2" | "h3" | "h4";
  eyebrow?: string;
  eyebrowScript?: boolean;
  className?: string;
  eyebrowClassName?: string;
  children: React.ReactNode;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 2,
      as,
      size,
      eyebrow,
      eyebrowScript = true,
      className,
      eyebrowClassName,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || (`h${level}` as const);
    const resolvedSize = size || (`h${level}` as const);

    const sizeStyles = {
      display: "font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] font-normal",
      h1: "font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.12] font-normal",
      h2: "font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-[1.18] font-normal",
      h3: "font-serif text-xl sm:text-2xl lg:text-3xl leading-[1.24] font-medium",
      h4: "font-serif text-lg sm:text-xl leading-[1.3] font-medium",
    };

    return (
      <div className="space-y-2">
        {eyebrow && (
          <span
            className={cn(
              eyebrowScript
                ? "font-script text-2xl sm:text-3xl text-wine-600 block leading-none"
                : "text-xs tracking-[0.2em] uppercase font-sans text-ink-soft block font-medium",
              eyebrowClassName
            )}
          >
            {eyebrow}
          </span>
        )}
        <Component
          ref={ref as React.Ref<HTMLHeadingElement>}
          className={cn(
            "text-ink text-balance",
            sizeStyles[resolvedSize],
            className
          )}
          {...props}
        >
          {children}
        </Component>
      </div>
    );
  }
);

Heading.displayName = "Heading";
