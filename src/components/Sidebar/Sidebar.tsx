import React from 'react';
import Panel from '../Panel/Panel';
import SkillBar from '../SkillsBar/SkillsBar';
import skillsData from '../../content/skills.json';
import navigationData from '../../content/navigation.json';
import { Briefcase } from 'pixelarticons/react/Briefcase';
import { Grid3x3 } from 'pixelarticons/react/Grid3x3';
import { User } from 'pixelarticons/react/User';
import { UserPlus as UserCircle } from 'pixelarticons/react/UserPlus';
import { Menu } from 'pixelarticons/react/Menu';
import { Zap } from 'pixelarticons/react/Zap';
import { Heart } from 'pixelarticons/react/Heart';
import { GitBranch } from 'pixelarticons/react/GitBranch';
import { FileSharp } from 'pixelarticons/react/FileSharp';
import { Camera } from 'pixelarticons/react/Camera';
import { VideoSharp } from 'pixelarticons/react/VideoSharp';

import './Sidebar.css';

const Icons: Record<string, React.FC<any>> = {
  Briefcase,
  Grid3x3,
  User,
};

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Panel title="About Me" icon={<UserCircle size={16} />}>
        <p>
          20+ years building web applications — strong depth in React, TypeScript,
          and API-driven frontends. I ship clean, performant UI in remote Agile teams.
        </p>
      </Panel>

      <Panel title="Navigation" icon={<Menu size={16} />}>
        <nav className="sidebar-nav">
          <ul>
            {navigationData.map((item) => {
              const IconComponent = Icons[item.icon];
              return (
                <li key={item.url}>
                  <a href={item.url}>
                    {IconComponent && <IconComponent size={20} className="nav-icon" />}
                    <span>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Panel>

      <Panel title="My Core Skills" icon={<Zap size={16} />}>
        <p>Tools I reach for on every project.</p>
        {skillsData.map((skill) => (
          <SkillBar 
            key={`skill-${skill.name}`}
            name={skill.name} 
            value={skill.value} 
            color={skill.color}
          />
        ))}
      </Panel>

      <Panel title="Socials" icon={<Heart size={16} />}>
        <div className="social-links">
          <a href="https://github.com/rdeeb" target="_blank" rel="noopener noreferrer" className="social-button github" aria-label="GitHub (opens in new tab)">
            <GitBranch size={20} aria-hidden="true" />
            <span>GitHub</span>
          </a>
          <a href="https://linkedin.com/in/rdeeb" target="_blank" rel="noopener noreferrer" className="social-button linkedin" aria-label="LinkedIn (opens in new tab)">
            <FileSharp size={20} aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
          <a href="https://www.instagram.com/rdeeb" target="_blank" rel="noopener noreferrer" className="social-button instagram" aria-label="Instagram (opens in new tab)">
            <Camera size={20} aria-hidden="true" />
            <span>Instagram</span>
          </a>
          <a href="https://www.youtube.com/@rdeebbuilds" target="_blank" rel="noopener noreferrer" className="social-button youtube" aria-label="YouTube (opens in new tab)">
            <VideoSharp size={20} aria-hidden="true" />
            <span>YouTube</span>
          </a>
        </div>
      </Panel>
    </aside>
  );
};

export default Sidebar;
