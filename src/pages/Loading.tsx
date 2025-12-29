import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CosmicBackground from "@/components/CosmicBackground";
import LoadingAnimation from "@/components/LoadingAnimation";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback: redirect to home if no AI response after 5 seconds
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(fallbackTimer);
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
