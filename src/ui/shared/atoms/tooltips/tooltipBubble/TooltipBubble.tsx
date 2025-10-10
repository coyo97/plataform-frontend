// src/ui/shared/atoms/tooltips/tooltipBubble/TooltipBubble.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip';
import { TooltipBubbleProps } from './TooltipBubble.types';
import { getTooltipStyles } from './tooltipBubble.styles';
import Text from '../../typography/Text';

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
	placement,              
	size = 'medium',
	className,
	showArrow = true,
	maxWidth = 300,
	children,
}) => {
	const effectivePlacement = placement ?? position;

	// Mapeo de tamaños a tus tokens (usando Text)
	const S = {
		small:  { title: 'sm', body: 'xs' },
		medium: { title: 'md', body: 'sm' },
		large:  { title: 'lg', body: 'md' },
	} as const;
	const map = S[size] ?? S.medium;

	const titleNodeOnly =
		content === undefined
			? (title ? <Text size={map.body as any}>{title}</Text> : null)
			: null;

			const fullNode =
				content !== undefined ? (
					<>
						{title ? (
							<Text size={map.title as any} weight="bold" sx={{ display: 'block', mb: 0.25 }}>

								{title}
							</Text>
						) : null}
						{typeof content === 'string' ? (
							<Text size={map.body as any}>{content}</Text>
						) : (
						content
						)}
					</>
			) : null;

			return (
				<StyledTooltip
					title={
						<div style={{ maxWidth }}>
							{titleNodeOnly ?? fullNode}
						</div>
					}
					placement={effectivePlacement}
					arrow={showArrow}
					variant={variant}
					size={size}
					className={className}
				>
					{/* envolvemos para que siempre haya un elemento */}
					    <div style={{ display: 'inline-flex' }}>{children}</div>
				</StyledTooltip>
			);
};

export default TooltipBubble;

