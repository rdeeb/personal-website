import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import React from 'react';
import { Zap } from 'pixelarticons/react/Zap';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'blue', 'azure', 'purple', 'rose', 'teal', 'green', 'yellow', 'orange', 'red'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Button with Icon',
    variant: 'azure',
    icon: <Zap size={16} />,
  },
};

export const IconRight: Story = {
  args: {
    children: 'Icon on Right',
    variant: 'purple',
    icon: <Zap size={16} />,
    iconPosition: 'right',
  },
};

export const AsLink: Story = {
  args: {
    children: 'Button as Link',
    variant: 'green',
    href: 'https://example.com',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

export const LinkWithIcon: Story = {
  args: {
    children: 'Link with Icon',
    variant: 'orange',
    href: '#',
    icon: <Zap size={16} />,
  },
};

export const Blue: Story = {
  args: {
    children: 'Blue Button',
    variant: 'blue',
  },
};

export const Azure: Story = {
  args: {
    children: 'Azure Button',
    variant: 'azure',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
    variant: 'purple',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
    variant: 'rose',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};
