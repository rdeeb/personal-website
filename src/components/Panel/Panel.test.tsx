import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Panel from './Panel';
import React from 'react';

describe('Panel', () => {
  it('renders correctly with children', () => {
    render(<Panel>Panel content</Panel>);
    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  it('renders a title when provided', () => {
    render(<Panel title="Test Title">Panel content</Panel>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Title');
  });

  it('renders an icon when provided with a title', () => {
    const Icon = () => <span data-testid="panel-icon">★</span>;
    render(<Panel title="Title with Icon" icon={<Icon />}>Panel content</Panel>);
    expect(screen.getByTestId('panel-icon')).toBeInTheDocument();
  });

  it('does not render title bar if no title is provided', () => {
    const { container } = render(<Panel>No Title</Panel>);
    expect(container.querySelector('.panel-title')).not.toBeInTheDocument();
  });
});
