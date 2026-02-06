import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CosmicBackground from "@/components/CosmicBackground";
import LoadingAnimation from "@/components/LoadingAnimation";
import { Progress } from "@/components/ui/progress";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;
  const [progress, setProgress] = useState(0);

  // Animate progress bar and navigate to results after 4 seconds
  useEffect(() => {
    if (!result) {
      // No result data, redirect to home
      navigate("/");
      return;
    }

    // Smooth progress animation
    const duration = 4000; // 4 seconds total
    const interval = 50; // Update every 50ms
    const increment = (100 / duration) * interval;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, interval);

    // Navigate to results after loading completes
    const navigationTimer = setTimeout(() => {
      navigate("/results", { state: { result } });
    }, duration + 500); // Extra 500ms for final animation

    return () => {
      clearInterval(progressTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate, result]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <CosmicBackground />
      
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <LoadingAnimation />
        
        {/* Progress indicator */}
        <div className="w-full max-w-xs mt-8 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <Progress 
            value={progress} 
            className="h-1.5 bg-secondary/30"
          />
          <p className="text-center text-xs text-muted-foreground/60 mt-3">
            {Math.round(progress)}% hoàn thành
          </p>
        </div>
      </main>
    </div>
  );
};

export default Loading;
