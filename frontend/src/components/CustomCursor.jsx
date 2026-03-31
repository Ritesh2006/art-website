import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const touchCheck = window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(touchCheck);
    if (touchCheck) return;

    const updateMousePosition = (e) => {
      if (!isVisible) setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (!e.target) return;
      
      const isClickable = 
        e.target.tagName?.toLowerCase() === 'a' ||
        e.target.tagName?.toLowerCase() === 'button' ||
        e.target.closest?.('a') !== null ||
        e.target.closest?.('button') !== null ||
        e.target.classList?.contains('artwork-card') ||
        e.target.classList?.contains('cat-card');
        
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      <motion.div
        animate={{
          x: mousePosition.x - (isHovering ? 40 : 18),
          y: mousePosition.y - (isHovering ? 40 : 18),
          height: isHovering ? 80 : 36,
          width: isHovering ? 80 : 36,
          backgroundColor: isHovering ? 'rgba(245, 176, 65, 0.12)' : 'transparent',
          border: isHovering ? '1.5px solid rgba(245, 176, 65, 0.8)' : '1px solid rgba(245, 176, 65, 0.4)',
          boxShadow: isHovering ? '0 0 25px rgba(245, 176, 65, 0.25)' : 'none'
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.4 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          backdropFilter: isHovering ? 'blur(2px)' : 'none'
        }}
      />
      
      <motion.div
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 1200, damping: 35 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: 8,
          width: 8,
          backgroundColor: '#f5b041',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
          mixBlendMode: 'difference'
        }}
      />
    </>
  );
}
