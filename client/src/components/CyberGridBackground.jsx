import React from 'react';

const CyberGridBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20"></div>
      
      {/* Radial Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/50"></div>
      
      {/* Animated Scanline */}
      <div className="scanline"></div>
      
      {/* Floating Blobs for depth */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-blue/5 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-purple/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default CyberGridBackground;
