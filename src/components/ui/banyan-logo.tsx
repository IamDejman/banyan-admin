import React from 'react';
import Image from 'next/image';

interface BanyanLogoProps {
  className?: string;
  size?: number;
}

export function BanyanLogo({ className = '', size = 32 }: BanyanLogoProps) {
  return (
    <Image
      src="/BanyanLogo.svg"
      alt="Banyan Logo"
      width={size}
      height={size}
      className={className}
    />
  );
} 