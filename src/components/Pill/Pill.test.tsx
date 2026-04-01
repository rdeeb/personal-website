import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Pill from './Pill';
import React from 'react';

describe('Pill', () => {
  it('renders with label correctly', () => {
    render(<Pill label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(<Pill label="Default" />);
    expect(container.firstChild).toHaveClass('pill--default');
  });

  it('applies correct variant class', () => {
    const { container } = render(<Pill label="Green" variant="green" />);
    expect(container.firstChild).toHaveClass('pill--green');
  });

  it('applies custom className', () => {
    const { container } = render(<Pill label="Custom" className="my-custom-class" />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
