import React from 'react';
import SkillsBar from './SkillsBar';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SkillsBar> = {
  title: 'Components/SkillsBar',
  component: SkillsBar,
  tags: ['autodocs'],
  args: {
    name: 'React',
    value: 85,
  },
};

export default meta;
type Story = StoryObj<typeof SkillsBar>;

export const Default: Story = {
  args: {
    name: 'TypeScript',
    value: 75,
  },
};

export const CustomColor: Story = {
  args: {
    name: 'Astro',
    value: 90,
    color: 'var(--orange-150)',
  },
};

export const LowValue: Story = {
  args: {
    name: 'Design',
    value: 20,
    color: 'var(--red-175)',
  },
};

export const HighValue: Story = {
  args: {
    name: 'Pixel Art',
    value: 100,
    color: 'var(--green-150)',
  },
};
