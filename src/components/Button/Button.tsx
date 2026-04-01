import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  variant?: 'blue' | 'azure' | 'purple' | 'rose' | 'teal' | 'green' | 'yellow' | 'orange' | 'red' | 'default';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  icon,
  iconPosition = 'left',
  href,
  className = '',
  style,
  ...props
}) => {
  const Component = href ? 'a' : 'button';
  const commonProps = { ...props };

  return (
    <Component
      className={`btn btn--${variant} btn--${size} ${className}`}
      href={href}
      {...(commonProps as any)}
    >
      <span className="btn-inner" style={style}>
        {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
        <span className="btn-text">{children}</span>
        {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
      </span>
    </Component>
  );
};

export default Button;
