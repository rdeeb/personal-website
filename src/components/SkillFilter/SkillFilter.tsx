import React from 'react';
import { getSkillColor } from '../../utils/skillColors';
import Button from '../Button/Button';
import './SkillFilter.css';

interface SkillFilterProps {
  allSkills: string[];
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  onClearFilters: () => void;
}

const SkillFilter = ({ allSkills, selectedSkills, onToggleSkill, onClearFilters }: SkillFilterProps) => {
  return (
    <div className="skill-filter-panel">
      <div className="skill-filter-header">
        <h3>Filter by Skills</h3>
        {selectedSkills.length > 0 && (
          <Button variant="default" size="small" onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </div>
      <div className="skill-filter-list">
        {allSkills.map(skill => {
          const isActive = selectedSkills.includes(skill);
          const skillColor = getSkillColor(skill);
          return (
            <Button
              key={skill}
              className={`skill-filter-item ${isActive ? 'active' : ''}`}
              onClick={() => onToggleSkill(skill)}
              aria-pressed={isActive}
              style={isActive ? {
                backgroundColor: skillColor,
                borderColor: skillColor,
                color: 'var(--white)',
                boxShadow: 'inset 2px 2px 0 0 rgba(0, 0, 0, 0.3)'
              } : {
                borderColor: skillColor,
                color: skillColor,
                backgroundColor: 'var(--white)'
              }}
            >
              {skill}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SkillFilter;
