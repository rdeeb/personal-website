import React from 'react';
import './Panel.css';

export type PanelProps = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Panel = ({ title, children, icon }: PanelProps) => {
  const renderTitleBar = () => {
    if (title) {
      return (
        <div className="panel-title">
          <div className="panel-title-inner">
            {icon && <span className="panel-icon">{icon}</span>}
            <h2>{title}</h2>
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
