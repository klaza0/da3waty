import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-rose text-white shadow-soft hover:bg-rose-deep disabled:opacity-60",
  secondary:
    "bg-white text-ink border border-line hover:border-gold/50 hover:bg-ivory",
  ghost: "bg-transparent text-ink hover:bg-black/5",
  gold: "bg-gold text-ink hover:bg-gold-deep",
  danger: "bg-transparent text-rose border border-rose/30 hover:bg-rose/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(function Button({ className, variant = "primary", size = "md", type = "button", ...props }, ref) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />;
});
