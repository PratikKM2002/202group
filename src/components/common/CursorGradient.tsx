import React, { useEffect, useState } from 'react';

const CursorGradient: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position as percentage of viewport
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPosition({ x, y });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-300"
      style={{
        opacity: isHovering ? 1 : 0.5,
        background: `
          radial-gradient(
            1200px circle at ${position.x}% ${position.y}%,
            rgba(29, 78, 216, 0.15),
            transparent 80%
          ),
          radial-gradient(
            800px circle at ${position.x}% ${position.y}%,
            rgba(124, 58, 237, 0.1),
            transparent 80%
          ),
          radial-gradient(
            600px circle at ${position.x}% ${position.y}%,
            rgba(37, 99, 235, 0.07),
            transparent 80%
          ),
          radial-gradient(
            400px circle at ${position.x}% ${position.y}%,
            rgba(99, 102, 241, 0.05),
            transparent 80%
          )
        `,
      }}
    />
  );
};

export default CursorGradient;