import React from 'react';
import Panel from './Panel';
import type {Meta, StoryObj} from '@storybook/react';
import { Zap } from 'pixelarticons/react/Zap';

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel',
  component: Panel,
  tags: ['autodocs'],
  args: {
    children: <div>Panel content</div>,
  },
  argTypes: {
    children: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  args: {
    title: 'Panel Title',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Panel with Icon',
    icon: <Zap size={16} />,
  },
};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
  },
};
