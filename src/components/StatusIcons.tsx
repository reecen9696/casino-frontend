import React from 'react';

interface StatusIconProps {
  className?: string;
  size?: number;
}

export const CheckIcon: React.FC<StatusIconProps> = ({ className = "", size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    height={`${size}px`} 
    viewBox="0 -960 960 960" 
    width={`${size}px`} 
    fill="currentColor"
    className={className}
  >
    <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
  </svg>
);

export const CancelIcon: React.FC<StatusIconProps> = ({ className = "", size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    height={`${size}px`} 
    viewBox="0 -960 960 960" 
    width={`${size}px`} 
    fill="currentColor"
    className={className}
  >
    <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
  </svg>
);

export const WarningIcon: React.FC<StatusIconProps> = ({ className = "", size = 16 }) => (
  <span className={`text-yellow-400 ${className}`} style={{ fontSize: `${size}px` }}>⚠️</span>
);