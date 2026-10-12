"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("divide-y divide-blush-300 border-y border-blush-300", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="py-5 sm:py-6 transition-colors">
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between gap-4 text-left font-serif text-xl sm:text-2xl text-ink hover:text-wine-600 focus-visible:outline-wine-600 transition-colors duration-200 cursor-pointer"
              >
                <span>{item.question}</span>
                <span
                  className={cn(
                    "flex-shrink-0 text-wine-600 transition-transform duration-300 ease-out",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown strokeWidth={1.25} className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={cn(
                "pt-4 pr-8 text-ink-soft text-base sm:text-lg leading-relaxed transition-all duration-300",
                !isOpen && "hidden"
              )}
            >
              {typeof item.answer === "string" ? <p>{item.answer}</p> : item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
};
