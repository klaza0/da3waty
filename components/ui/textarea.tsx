import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-gold",
          className,
        )}
        {...props}
      />
    );
  },
);
