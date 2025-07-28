import React from 'react';

interface NairaIconProps {
  className?: string;
  size?: number;
}

export function NairaIcon({ className = "", size = 24 }: NairaIconProps) {
  return (
    <span 
      className={className}
      style={{ 
        fontSize: `${size}px`,
        lineHeight: 1,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 'bold'
      }}
    >
      ₦
    </span>
  );
} 