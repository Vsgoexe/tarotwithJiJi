import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className, required, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-ink tracking-wide"
          >
            {label}
            {required && <span className="text-wine-600 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full h-12 px-4 rounded-xl bg-ivory text-ink placeholder:text-ink-soft/60",
            "border border-blush-300 transition-colors duration-200",
            "focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600",
            error && "border-rose-400 focus:border-wine-600 focus:ring-wine-600",
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p id={helperId} className="text-xs text-ink-soft">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-wine-600 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
