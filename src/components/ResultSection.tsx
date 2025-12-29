import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResultSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  delay?: number;
  className?: string;
}

const ResultSection = ({ title, children, icon, delay = 0, className }: ResultSectionProps) => {
  return (
    <div 
      className={cn(
        "mystic-card p-6 animate-fade-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-serif font-medium mystic-text-gradient">
          {title}
        </h3>
      </div>
      <div className="text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default ResultSection;
