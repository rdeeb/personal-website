import React, { useState, useMemo } from 'react';
import Timeline from './Timeline/Timeline';
import type { CVItem } from './Timeline/Timeline';
import SkillFilter from './SkillFilter/SkillFilter';
import Button from './Button/Button';

interface CVPageProps {
  initialItems: CVItem[];
}

const CVPage = ({ initialItems }: CVPageProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    initialItems.forEach(item => {
      item.skills.forEach(skill => skillsSet.add(skill));
    });
    return Array.from(skillsSet).sort();
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    if (selectedSkills.length === 0) return initialItems;
    return initialItems.filter(item =>
      selectedSkills.every(skill => item.skills.includes(skill))
    );
  }, [initialItems, selectedSkills]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
  };

  return (
    <div className="cv-page-container">
      <header className="cv-page-header">
        <h1>Curriculum Vitae</h1>
        <p>A journey through my professional experience and skills.</p>
      </header>
      
      <SkillFilter 
        allSkills={allSkills} 
        selectedSkills={selectedSkills} 
        onToggleSkill={toggleSkill}
        onClearFilters={clearFilters}
      />
      
      {filteredItems.length > 0 ? (
        <Timeline items={filteredItems} />
      ) : (
        <div className="no-results">
          <p>No items match the selected skills. Try clearing the filters.</p>
          <Button variant="default" onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default CVPage;
