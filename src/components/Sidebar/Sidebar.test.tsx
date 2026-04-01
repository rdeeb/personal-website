import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';
import React from 'react';

// Mock navigation and skills data
vi.mock('../../content/navigation.json', () => ({
  default: [
    { name: 'Home', url: '/', icon: 'User' },
    { name: 'CV', url: '/cv', icon: 'Briefcase' }
  ]
}));

vi.mock('../../content/skills.json', () => ({
  default: [
    { name: 'React', value: 90, color: 'blue' }
  ]
}));

// Mock pixelarticons to avoid issues with SVG components in tests if needed, 
// but usually vitest handles them if using @vitejs/plugin-react
// Let's see if it works without mocking first.

describe('Sidebar', () => {
  it('renders correctly', () => {
    render(<Sidebar />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('My Core Skills')).toBeInTheDocument();
    expect(screen.getByText('Socials')).toBeInTheDocument();
  });

  it('renders navigation links from data', () => {
    render(<Sidebar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('CV')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('href', '/');
  });

  it('renders skills from data', () => {
    render(<Sidebar />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });
});
