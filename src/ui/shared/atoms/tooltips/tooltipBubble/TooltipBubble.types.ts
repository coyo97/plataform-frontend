// src/ui/shared/atoms/tooltips/tooltipBubble/TooltipBubble.types.ts
import { ReactNode } from 'react';

export type TooltipVariant = 'light' | 'dark' | 'primary';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipSize = 'small' | 'medium' | 'large';

export interface TooltipBubbleProps {
  title?: string;
  content?: string | ReactNode;
  variant?: TooltipVariant;
  position?: TooltipPosition;
  placement?: TooltipPosition;
  size?: TooltipSize;
  className?: string;
  showArrow?: boolean;
  maxWidth?: number;
  children: ReactNode;
}

