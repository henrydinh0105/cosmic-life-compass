import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  active: boolean;
}

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 5000);
      starsRef.current = [];
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 3 + 1,
        });
      }
      
      // Initialize shooting stars pool
      shootingStarsRef.current = Array.from({ length: 3 }, () => ({
        x: 0,
        y: 0,
        length: 0,
        speed: 0,
        opacity: 0,
        angle: 0,
        active: false,
      }));
    };

    const spawnShootingStar = () => {
      const inactive = shootingStarsRef.current.find(s => !s.active);
      if (inactive && Math.random() < 0.008) {
        inactive.x = Math.random() * canvas.width;
        inactive.y = Math.random() * (canvas.height * 0.5);
        inactive.length = Math.random() * 80 + 50;
        inactive.speed = Math.random() * 15 + 10;
        inactive.opacity = 1;
        inactive.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
        inactive.active = true;
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(Date.now() * star.twinkleSpeed * 0.001) * 0.4 + 0.6;
        const currentOpacity = star.opacity * twinkle;

        // Star glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
        gradient.addColorStop(0, `rgba(220, 200, 255, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(180, 160, 255, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, "transparent");
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 250, 255, ${currentOpacity})`;
        ctx.fill();
      });

      // Spawn and draw shooting stars
      spawnShootingStar();
      shootingStarsRef.current.forEach((star) => {
        if (!star.active) return;

        const endX = star.x + Math.cos(star.angle) * star.length;
        const endY = star.y + Math.sin(star.angle) * star.length;

        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.3, `rgba(200, 180, 255, ${star.opacity * 0.8})`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Move shooting star
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.015;

        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          star.active = false;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Deep cosmic gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-mystic-cosmic to-background" />
      
      {/* Animated nebula effects */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary/30 via-primary/10 to-transparent blur-3xl animate-nebula-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-radial from-accent/25 via-accent/10 to-transparent blur-3xl animate-nebula-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-radial from-mystic-violet/20 via-mystic-indigo/10 to-transparent blur-3xl animate-nebula-3" />
      </div>

      {/* Floating mystical orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-3 h-3 rounded-full bg-primary/60 blur-sm animate-float-orb-1" />
        <div className="absolute top-[30%] right-[20%] w-2 h-2 rounded-full bg-accent/50 blur-sm animate-float-orb-2" />
        <div className="absolute bottom-[25%] left-[25%] w-4 h-4 rounded-full bg-mystic-violet/40 blur-sm animate-float-orb-3" />
        <div className="absolute top-[60%] right-[10%] w-2 h-2 rounded-full bg-primary/40 blur-sm animate-float-orb-4" />
      </div>
      
      {/* Star canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
      />

      {/* Subtle vignette */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-background/50" />
    </>
  );
};

export default CosmicBackground;
