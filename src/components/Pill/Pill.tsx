import React from 'react';
import './Pill.css';

interface PillProps {
  label: string;
  variant?: 'blue' | 'azure' | 'purple' | 'rose' | 'teal' | 'green' | 'yellow' | 'orange' | 'red' | 'default';
  className?: string;
  style?: React.CSSProperties;
}

const Pill: React.FC<PillProps> = ({ label, variant = 'default', className = '', style }) => {
  return (
    <span className={`pill pill--${variant} ${className}`} style={style}>
      {label}
    </span>
  );
};

export default Pill;
