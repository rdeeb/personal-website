import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';
import React from 'react';

describe('Button', () => {
  it('renders correctly with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as a button by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders as an anchor when href is provided', () => {
    render(<Button href="https://example.com">Link</Button>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link.tagName).toBe('A');
  });

  it('applies the correct variant class', () => {
    const { container } = render(<Button variant="blue">Blue</Button>);
    expect(container.firstChild).toHaveClass('btn--blue');
  });

  it('applies the correct size class', () => {
    const { container } = render(<Button size="large">Large</Button>);
    expect(container.firstChild).toHaveClass('btn--large');
  });

  it('renders an icon on the left by default', () => {
    const Icon = () => <span data-testid="test-icon" />;
    render(<Button icon={<Icon />}>With Icon</Button>);
    const icon = screen.getByTestId('test-icon');
    const text = screen.getByText('With Icon');
    
    // Check order in the DOM
    const inner = screen.getByText('With Icon').parentElement;
    expect(inner?.firstChild).toContainElement(icon);
  });

  it('renders an icon on the right when iconPosition is right', () => {
    const Icon = () => <span data-testid="test-icon" />;
    render(<Button icon={<Icon />} iconPosition="right">With Icon</Button>);
    const icon = screen.getByTestId('test-icon');
    
    const inner = screen.getByText('With Icon').parentElement;
    expect(inner?.lastChild).toContainElement(icon);
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is passed', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies style to the inner span instead of the root element', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<Button style={customStyle}>Styled</Button>);
    
    const root = screen.getByRole('button');
    const inner = root.querySelector('.btn-inner');
    
    expect(root).not.toHaveStyle('background-color: red');
    expect(inner).toHaveStyle('background-color: rgb(255, 0, 0)');
  });
});
