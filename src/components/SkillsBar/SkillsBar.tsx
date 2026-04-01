import React from 'react';
import './SkillsBar.css';

interface SkillsBarProps {
  name: string;
  value: number; // 0 to 100
  color?: string;
}

const SkillsBar: React.FC<SkillsBarProps> = ({ name, value, color }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className="skills-bar-container">
      <div className="skills-bar-info">
        <span className="skills-bar-name">{name}</span>
        <span className="skills-bar-value">{clampedValue}%</span>
      </div>
      <div className="skills-bar-track">
        <div 
          className="skills-bar-fill" 
          style={{ 
            width: `${clampedValue}%`,
            backgroundColor: color || 'var(--azure-150)'
          }}
        />
      </div>
    </div>
  );
};

export default SkillsBar;
