import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = "primary", size = "md", href, className, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-wine-600 focus-visible:outline-offset-2";

    const variantStyles = {
      primary:
        "bg-wine-600 text-ivory hover:bg-wine-700 shadow-sm hover:shadow active:bg-wine-700/90",
      secondary:
        "bg-blush-100 text-wine-600 hover:bg-blush-300/60 border border-blush-300",
      outline:
        "bg-transparent text-wine-600 border border-wine-600 hover:bg-blush-100/50 active:bg-blush-100",
      ghost:
        "bg-transparent text-ink hover:text-wine-600 hover:bg-blush-100/40",
    };

    const sizeStyles = {
      sm: "min-h-[40px] px-5 py-2 text-sm",
      md: "min-h-[48px] px-7 py-3 text-base tracking-wide",
      lg: "min-h-[54px] px-9 py-3.5 text-lg tracking-wide",
    };

    const combinedClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      return (
        <Link
          href={href}
          className={combinedClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={combinedClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
