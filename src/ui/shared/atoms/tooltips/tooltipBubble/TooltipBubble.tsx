// src/ui/shared/atoms/tooltips/tooltipBubble/TooltipBubble.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { TooltipBubbleProps } from './TooltipBubble.types';
import { getTooltipStyles } from './tooltipBubble.styles';

interface StyledTooltipProps {
	variant?: 'dark' | 'light' | 'primary';
	size?: 'small' | 'medium' | 'large';
	className?: string;
}

const StyledTooltip = styled(
	({ className, ...props }: TooltipProps) => (
		<MuiTooltip {...props} arrow classes={{ popper: className }} />
	)
)<StyledTooltipProps>(({ theme, variant = 'dark', size = 'medium' }) => ({
	...getTooltipStyles(theme, variant, size),
}));

const TooltipBubble: React.FC<TooltipBubbleProps> = ({
	title,
	content,
	variant = 'dark',
	position = 'bottom',
	size = 'medium',
	className,
	showArrow = true,
	maxWidth = 300,
	children,
}) => {
	return (
		<StyledTooltip
			title={
				<div style={{ maxWidth }}>
					{title && (
						<Typography variant="subtitle2" fontWeight={600} gutterBottom>
							{title}
						</Typography>
					)}
					{typeof content === 'string' ? (
						<Typography variant="body2">{content}</Typography>
					) : (
						content
					)}
				</div>
			}
			placement={position}
			arrow={showArrow}
			// 👇 solo los pasamos al styled, no a MuiTooltip
			variant={variant}
			size={size}
			className={className}
		>
			<span>{children}</span>
		</StyledTooltip>
	);
};

export default TooltipBubble;

