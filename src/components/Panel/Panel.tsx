import React from 'react';
import './Panel.css';

export type PanelProps = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const Panel = ({ title, children, icon, headingLevel = 2 }: PanelProps) => {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const renderTitleBar = () => {
    if (title) {
      return (
        <div className="panel-title">
          <div className="panel-title-inner">
            {icon && <span className="panel-icon">{icon}</span>}
            <Heading>{title}</Heading>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="panel">
      {title && renderTitleBar()}
      <div className="panel-content">
        {children}
      </div>
    </div>
  )
};

export default Panel;
