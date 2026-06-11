import React, { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

const CyberGridBackground = () => {
  const { settings } = useSettings();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!settings.gridBackground) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(45, Math.floor((width * height) / 35000));

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${this.alpha})`; // Purple particles
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#7C3AED';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw lines between close particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - dist / 120)})`; // Blue links
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [settings.gridBackground]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background">
      {/* 1. Subtle Radial Backlight */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] glow-blob-purple opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] glow-blob-blue opacity-50"></div>

      {/* 2. Cyber grid layer */}
      {settings.gridBackground && (
        <div className="absolute inset-0 cyber-grid-bg opacity-30"></div>
      )}

      {/* 3. Floating interactive network canvas */}
      {settings.gridBackground && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      )}

      {/* 4. Scanning lines */}
      {settings.gridBackground && <div className="scanline"></div>}
    </div>
  );
};

export default CyberGridBackground;
