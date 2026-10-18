import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-2xl border border-line bg-white px-4 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-gold",
          className,
        )}
        {...props}
      />
    );
  },
);
