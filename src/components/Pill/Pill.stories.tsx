import React from 'react';
import Pill from './Pill';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  tags: ['autodocs'],
  args: {
    label: 'Tag',
  },
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Blue: Story = {
  args: {
    variant: 'blue',
  },
};

export const Azure: Story = {
  args: {
    variant: 'azure',
  },
};

export const Purple: Story = {
  args: {
    variant: 'purple',
  },
};

export const Rose: Story = {
  args: {
    variant: 'rose',
  },
};

export const Teal: Story = {
  args: {
    variant: 'teal',
  },
};

export const Green: Story = {
  args: {
    variant: 'green',
  },
};

export const Yellow: Story = {
  args: {
    variant: 'yellow',
  },
};

export const Orange: Story = {
  args: {
    variant: 'orange',
  },
};

export const Red: Story = {
  args: {
    variant: 'red',
  },
};
