import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import Timeline, { CVItem } from './Timeline';

const mockItems: CVItem[] = [
  {
    id: '1',
    company: 'Company A',
    position: 'Developer',
    period: '2020 - 2021',
    brief: 'A brief description',
    skills: ['React', 'TypeScript'],
    details: 'More detailed explanation',
    url: 'https://example.com'
  }
];

describe('Timeline', () => {
  it('renders items correctly', () => {
    render(<Timeline items={mockItems} />);
    expect(screen.getByText('Company A')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('2020 - 2021')).toBeInTheDocument();
  });

  it('toggles detailed content when View More/Less is clicked', () => {
    render(<Timeline items={mockItems} />);
    
    // Check that details are not initially visible
    expect(screen.queryByText('More detailed explanation')).not.toBeInTheDocument();
    
    // Find and click the "View More" button
    const viewMoreBtn = screen.getByText('View More');
    fireEvent.click(viewMoreBtn);
    
    // Check that details are now visible
    expect(screen.getByText('More detailed explanation')).toBeInTheDocument();
    expect(screen.getByText('View Project')).toBeInTheDocument();
    expect(screen.getByText('View Less')).toBeInTheDocument();
    
    // Click "View Less"
    fireEvent.click(screen.getByText('View Less'));
    
    // Check that details are hidden again
    expect(screen.queryByText('More detailed explanation')).not.toBeInTheDocument();
    expect(screen.getByText('View More')).toBeInTheDocument();
  });
});
