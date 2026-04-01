import React, { useState, useEffect, useRef } from 'react';
import { getSkillColor } from '../../utils/skillColors';
import Button from '../Button/Button';
import Pill from '../Pill/Pill';
import './Timeline.css';

export interface CVItem {
  id: string;
  company: string;
  position: string;
  period: string;
  brief: string;
  skills: string[];
  details: string;
  url?: string;
}

interface TimelineProps {
  items: CVItem[];
}

const TimelineItem = ({ item, index }: { item: CVItem; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`timeline-item ${isLeft ? 'left' : 'right'}${isVisible ? ' is-visible' : ''}`}
    >
      <div className="timeline-dot" />
      <div className="timeline-content-wrapper">
        <div className="timeline-card">
          <div className="timeline-header">
            <span className="timeline-period">{item.period}</span>
            <h3>{item.position}</h3>
            <h4>{item.company}</h4>
          </div>
          
          <div className="timeline-body">
            <p className="timeline-brief">{item.brief}</p>
            
            <div className="timeline-skills">
              {item.skills.map(skill => (
                <Pill 
                  key={skill} 
                  label={skill}
                  style={{ 
                    borderColor: getSkillColor(skill),
                    backgroundColor: 'var(--white)',
                    color: getSkillColor(skill)
                  }}
                />
              ))}
            </div>

            {isExpanded && (
              <div className="timeline-details" id={`timeline-details-${item.id}`}>
                <p>{item.details}</p>
                {item.url && (
                  <Button 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    variant="green"
                    size="small"
                    className="project-link-btn"
                  >
                    View Project
                  </Button>
                )}
              </div>
            )}
            
            <div className="timeline-actions">
              <Button
                variant="default"
                size="small"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls={`timeline-details-${item.id}`}
              >
                {isExpanded ? 'View Less' : 'View More'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Timeline = ({ items }: TimelineProps) => {
  return (
    <div className="timeline-container">
      <div className="timeline-trunk" />
      {items.map((item, index) => (
        <TimelineItem key={item.id} item={item} index={index} />
      ))}
    </div>
  );
};

export default Timeline;
