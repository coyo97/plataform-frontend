// src/ui/shared/atoms/dateTime/dateTimeInfo.types.ts
export type TimeFormat = 'relative' | 'absolute' | 'calendar';
export type Variant = 'default' | 'compact' | 'expanded';
export type Size = 'small' | 'medium' | 'large';
export type IconPosition = 'left' | 'right';

export interface DateTimeInfoProps {
	timestamp: Date | number | string;
	format?: TimeFormat;
	showIcon?: boolean;
	iconPosition?: IconPosition;
	variant?: Variant;
	size?: Size;
	className?: string;
	tooltipFormat?: TimeFormat;
	showTooltip?: boolean;
}

