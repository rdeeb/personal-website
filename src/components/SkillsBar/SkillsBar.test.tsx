import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkillsBar from './SkillsBar';
import React from 'react';

describe('SkillsBar', () => {
  it('renders name and value correctly', () => {
    render(<SkillsBar name="TypeScript" value={85} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('clamps values below 0 to 0', () => {
    render(<SkillsBar name="Min" value={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('clamps values above 100 to 100', () => {
    render(<SkillsBar name="Max" value={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('applies the correct width to the progress bar', () => {
    const { container } = render(<SkillsBar name="Width" value={75} />);
    const fill = container.querySelector('.skills-bar-fill');
    expect(fill).toHaveStyle({ width: '75%' });
  });

  it('applies custom color if provided', () => {
    const { container } = render(<SkillsBar name="Color" value={50} color="#ff0000" />);
    const fill = container.querySelector('.skills-bar-fill');
    expect(fill).toHaveStyle({ 'background-color': '#ff0000' });
  });
});
