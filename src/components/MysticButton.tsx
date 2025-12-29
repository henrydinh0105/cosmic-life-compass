import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface MysticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg" | "sm";
}

const MysticButton = forwardRef<HTMLButtonElement, MysticButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          // Size variants
          size === "default" && "px-8 py-4 text-base",
          size === "lg" && "px-12 py-5 text-lg",
          size === "sm" && "px-6 py-3 text-sm",
          // Style variants
          variant === "primary" && [
            "text-primary-foreground",
            "bg-gradient-to-r from-primary to-accent",
            "shadow-[0_0_30px_hsl(262_80%_50%_/_0.4)]",
            "hover:shadow-[0_0_50px_hsl(262_80%_50%_/_0.6)]",
            "hover:-translate-y-1",
            "active:translate-y-0",
          ],
          variant === "secondary" && [
            "text-foreground",
            "bg-secondary/50 border border-border/50",
            "hover:bg-secondary/80",
            "hover:border-primary/30",
          ],
          variant === "ghost" && [
            "text-muted-foreground",
            "hover:text-foreground",
            "hover:bg-secondary/30",
          ],
          className
        )}
        {...props}
      >
        {/* Glow effect for primary button */}
        {variant === "primary" && (
          <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

MysticButton.displayName = "MysticButton";

export default MysticButton;
