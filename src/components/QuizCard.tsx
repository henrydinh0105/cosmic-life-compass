import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface QuizCardProps {
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const QuizCard = ({ label, description, selected, onClick, icon }: QuizCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full p-5 rounded-2xl text-left transition-all duration-300",
        "border backdrop-blur-sm",
        selected
          ? "border-primary/60 bg-primary/10 shadow-[0_0_20px_hsl(262_80%_50%_/_0.2)]"
          : "border-border/40 bg-card/50 hover:border-primary/30 hover:bg-card/80"
      )}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
            selected ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
          )}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium transition-colors",
            selected ? "text-foreground" : "text-foreground/90"
          )}>
            {label}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30"
        )}>
          {selected && <Check className="w-4 h-4" />}
        </div>
      </div>
    </button>
  );
};

export default QuizCard;
