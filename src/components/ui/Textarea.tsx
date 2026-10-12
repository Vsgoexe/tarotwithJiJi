import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxChars?: number;
  currentChars?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxChars,
      currentChars,
      id,
      className,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-sm font-medium text-ink tracking-wide"
            >
              {label}
              {required && <span className="text-wine-600 ml-1" aria-hidden="true">*</span>}
            </label>
          )}
          {typeof maxChars === "number" && typeof currentChars === "number" && (
            <span
              className={cn(
                "text-xs tracking-wider",
                currentChars > maxChars ? "text-wine-600 font-semibold" : "text-ink-soft"
              )}
            >
              {currentChars}/{maxChars}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full min-h-[120px] p-4 rounded-xl bg-ivory text-ink placeholder:text-ink-soft/60 leading-relaxed",
            "border border-blush-300 transition-colors duration-200 resize-y",
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

Textarea.displayName = "Textarea";
