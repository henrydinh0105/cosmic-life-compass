import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CosmicBackground from "@/components/CosmicBackground";
import LoadingAnimation from "@/components/LoadingAnimation";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If user directly navigates here without coming from quiz, redirect to start
  useEffect(() => {
    // Check if we came from the quiz
    const timer = setTimeout(() => {
      // This page is just for the loading animation
      // The actual navigation to results happens in Quiz.tsx when result is ready
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <CosmicBackground />
      
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <LoadingAnimation />
      </main>
    </div>
  );
};

export default Loading;
