import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard.tsx';
import type { Project } from './ProjectCard.tsx';
import SkillFilter from '../SkillFilter/SkillFilter.tsx';
import './ProjectsPage.css';

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => skillsSet.add(tech));
    });
    return Array.from(skillsSet).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedSkills.length === 0) return projects;
    return projects.filter(project =>
      selectedSkills.every(skill => project.technologies.includes(skill))
    );
  }, [projects, selectedSkills]);

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
    <div className="projects-page-container">
      <header className="projects-page-header">
        <h1>Projects</h1>
        <p>A collection of my work, from professional projects to personal experiments.</p>
      </header>

      <SkillFilter 
        allSkills={allSkills} 
        selectedSkills={selectedSkills} 
        onToggleSkill={toggleSkill}
        onClearFilters={clearFilters}
      />

      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={`${project.name}-${index}`} project={project} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No projects match the selected skills. Try clearing the filters.</p>
          <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
