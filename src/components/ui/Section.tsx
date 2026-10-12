import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "paper" | "blush" | "ivory";
  contained?: boolean;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      variant = "paper",
      contained = true,
      className,
      containerClassName,
      children,
      ...props
    },
    ref
  ) => {
    const bgStyles = {
      paper: "bg-paper",
      blush: "bg-blush-100",
      ivory: "bg-ivory",
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative py-20 lg:py-32 overflow-hidden",
          bgStyles[variant],
          className
        )}
        {...props}
      >
        {contained ? (
          <Container className={containerClassName}>{children}</Container>
        ) : (
          children
        )}
      </section>
    );
  }
);

Section.displayName = "Section";
