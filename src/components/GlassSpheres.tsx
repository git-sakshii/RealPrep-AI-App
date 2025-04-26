import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface Line {
  text: string;
  x: number;
  y: number;
  size: number;
  isTitle?: boolean;
}

interface SphereProps {
  delay: number;
  duration: number;
  size: string;
  x: number;
  y: number;
}

const GlassSpheres = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with proper scaling
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Track mouse position for light effects
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrame: number;
    
    // Lines with their positions for hover detection
    const lines: Line[] = [
      { text: 'RealPrep -', x: canvas.width * 0.05, y: canvas.height * 0.25, size: 96, isTitle: true },
      { text: 'CRUSH YOUR', x: canvas.width * 0.05, y: canvas.height * 0.35, size: 72 },
      { text: 'INTERVIEWS WITH', x: canvas.width * 0.05, y: canvas.height * 0.45, size: 72 },
      { text: 'AI POWERED', x: canvas.width * 0.05, y: canvas.height * 0.55, size: 72 },
      { text: 'MOCK SESSIONS', x: canvas.width * 0.05, y: canvas.height * 0.65, size: 72 }
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(1, '#121212');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw light source following mouse
      const glowRadius = 400;
      const radialGlow = ctx.createRadialGradient(
        mousePosition.x, mousePosition.y, 0,
        mousePosition.x, mousePosition.y, glowRadius
      );
      radialGlow.addColorStop(0, 'rgba(255, 0, 0, 0.15)');
      radialGlow.addColorStop(0.5, 'rgba(255, 0, 0, 0.08)');
      radialGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw text with glass effect
      lines.forEach((line, index) => {
        const isHovered = hoveredLine === index;
        
        // Set text style
        ctx.textAlign = 'left';
        ctx.font = `bold ${isHovered ? line.size + 8 : line.size}px Montserrat`;
        
        // Text shadow for depth
        ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
        ctx.shadowBlur = isHovered ? 30 : 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw text with glass effect
        if (isHovered) {
          // Create glowing effect
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fillText(line.text, line.x, line.y);
          
          // Add accent line
          const textWidth = ctx.measureText(line.text).width;
          ctx.beginPath();
          ctx.moveTo(line.x, line.y + 15);
          ctx.lineTo(line.x + textWidth, line.y + 15);
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          // Normal text with subtle gradient
          const textGradient = ctx.createLinearGradient(
            line.x, line.y - line.size, 
            line.x, line.y
          );
          
          if (line.isTitle) {
            textGradient.addColorStop(0, '#ff3232');
            textGradient.addColorStop(1, '#ff0000');
          } else {
            textGradient.addColorStop(0, '#ffffff');
            textGradient.addColorStop(1, '#cccccc');
          }
          
          ctx.fillStyle = textGradient;
          ctx.fillText(line.text, line.x, line.y);
        }
        
        // Reset shadow
        ctx.shadowBlur = 0;
      });

      // Draw decorative lines
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.05, canvas.height * 0.15);
      ctx.lineTo(canvas.width * 0.4, canvas.height * 0.15);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.05, canvas.height * 0.75);
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.75);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Detect text hover
    const handleCanvasHover = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      let hovered: number | null = null;
      
      lines.forEach((line, index) => {
        ctx.font = `bold ${line.size}px Montserrat`;
        const textWidth = ctx.measureText(line.text).width;
        const textHeight = line.size;
        
        if (
          x >= line.x &&
          x <= line.x + textWidth &&
          y >= line.y - textHeight &&
          y <= line.y + 15
        ) {
          hovered = index;
        }
      });
      
      setHoveredLine(hovered);
    };
    
    canvas.addEventListener('mousemove', handleCanvasHover);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousemove', handleCanvasHover);
      cancelAnimationFrame(animationFrame);
    };
  }, [mousePosition, hoveredLine, dimensions]);

  const Sphere = ({ delay, duration, size, x, y }: SphereProps) => (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-md"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, x: `${x}%`, y: `${y}%` }}
      animate={{ 
        opacity: [0.2, 0.5, 0.2],
        x: [`${x}%`, `${x + 5}%`, `${x}%`],
        y: [`${y}%`, `${y - 5}%`, `${y}%`]
      }}
      transition={{ 
        duration: duration, 
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Glass spheres */}
      <Sphere delay={0} duration={8} size="150px" x={80} y={20} />
      <Sphere delay={1} duration={12} size="250px" x={10} y={70} />
      <Sphere delay={2} duration={10} size="200px" x={70} y={80} />
      <Sphere delay={3} duration={9} size="180px" x={20} y={30} />
      <Sphere delay={4} duration={11} size="220px" x={90} y={50} />
      
      {/* Main content */}
      <motion.canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* CTA Button */}
      <motion.div 
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <button className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-700 to-red-600 rounded-md hover:from-red-600 hover:to-red-500 shadow-lg transform transition hover:scale-105">
          START PRACTICING NOW
        </button>
      </motion.div>
    </div>
  );
};

export default GlassSpheres;