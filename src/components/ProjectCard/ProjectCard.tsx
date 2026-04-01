import React from 'react';
import Panel from '../Panel/Panel.tsx';
import Pill from '../Pill/Pill.tsx';
import Button from '../Button/Button.tsx';
import { getSkillColor } from '../../utils/skillColors.ts';
import './ProjectCard.css';

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  github_url: string;
  live_url: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Panel title={project.name} className="project-card-panel">
      <div className="project-card-content">
        <p className="project-description">{project.description}</p>
        <div className="project-technologies">
          {project.technologies.map((tech) => (
            <Pill 
              key={tech} 
              label={tech}
              style={{ 
                borderColor: getSkillColor(tech),
                backgroundColor: 'var(--white)',
                color: getSkillColor(tech)
              }}
            />
          ))}
        </div>
        <div className="project-links">
          {project.live_url && (
            <Button 
              href={project.live_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              variant="green"
              size="small"
            >
              Live Demo
            </Button>
          )}
          {project.github_url && (
            <Button 
              href={project.github_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              variant="yellow"
              size="small"
            >
              GitHub
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
};

export default ProjectCard;
