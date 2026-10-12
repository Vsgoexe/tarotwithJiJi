import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      id,
      className,
      children,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-ink tracking-wide"
          >
            {label}
            {required && <span className="text-wine-600 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full h-12 pl-4 pr-10 rounded-xl bg-ivory text-ink appearance-none cursor-pointer",
              "border border-blush-300 transition-colors duration-200",
              "focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600",
              error && "border-rose-400 focus:border-wine-600 focus:ring-wine-600",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span
            className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-soft"
            aria-hidden="true"
          >
            <ChevronDown strokeWidth={1.25} className="w-4 h-4" />
          </span>
        </div>
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

Select.displayName = "Select";
