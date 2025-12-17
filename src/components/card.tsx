import React, { forwardRef, HTMLAttributes } from "react";

// Utility simple class merge (avoid adding a dependency)
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: "gradient" | "plain";
  /** Remove default padding (so consumer can control fully) */
  unpadded?: boolean;
  /** Use more subtle shadow */
  subtle?: boolean;
}

/**
 * Card: reusable container styled to match project gradient/glass motif.
 * Structure helpers: <CardHeader>, <CardContent>, <CardFooter>, <CardTitle>, <CardDescription>.
 * Example:
 * <Card variant="gradient">
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>Body...</CardContent>
 *   <CardFooter>Actions</CardFooter>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, variant = "gradient", unpadded, subtle, ...rest }, ref
) {
  if (variant === "plain") {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-gray-200 bg-white",
          subtle ? "shadow-sm" : "shadow",
          unpadded ? "" : "p-6",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }

  // Gradient variant (matches Janma page styling)
  return (
    <div className={cn("relative w-full rounded-2xl p-[1px] bg-[var(--vedanga-gradient)]", subtle ? "shadow-md" : "shadow-lg shadow-orange-200/40", className)}>
      <div
        ref={ref}
        className={cn(
          "relative rounded-[1.05rem] bg-white/90 backdrop-blur-sm border border-white/40 overflow-hidden",
          unpadded ? "" : "px-6 sm:px-8 py-6 sm:py-8"
        )}
        {...rest}
      >
        {/* Decorative ambient glow */}
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-400/20 via-rose-400/10 to-transparent blur-2xl" />
        {children}
      </div>
    </div>
  );
});

export type CardSectionProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader({ className, children, ...rest }, ref) {
  return (
    <div ref={ref} className={cn("flex flex-col gap-2 pb-5 border-b border-white/50 relative z-10", className)} {...rest}>
      {children}
    </div>
  );
});

export const CardContent = forwardRef<HTMLDivElement, CardSectionProps>(function CardContent({ className, children, ...rest }, ref) {
  return (
    <div ref={ref} className={cn("relative z-10", className)} {...rest}>
      {children}
    </div>
  );
});

export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter({ className, children, ...rest }, ref) {
  return (
    <div ref={ref} className={cn("flex items-center gap-4 pt-4 mt-2 border-t border-white/40 relative z-10", className)} {...rest}>
      {children}
    </div>
  );
});

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(function CardTitle({ className, children, ...rest }, ref) {
  return (
    <h2 ref={ref} className={cn("text-xl sm:text-2xl font-semibold tracking-tight bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent", className)} {...rest}>
      {children}
    </h2>
  );
});

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(function CardDescription({ className, children, ...rest }, ref) {
  return (
    <p ref={ref} className={cn("text-xs md:text-sm text-gray-700/80", className)} {...rest}>
      {children}
    </p>
  );
});

export default Card;
