// src/ui/shared/atoms/badges/Badge.tsx
import React from 'react';
import { BadgeWrapper, Icon, Image, Label } from './badge.styles';
import { BadgeProps } from './badge.types';

const Badge: React.FC<BadgeProps> = ({
	variant = 'filled',
	color = 'primary',
	shape = 'default',
	size = 'md',
	icon,
	image,
	interactive = false,
	ariaLabel,
	children,
	onClick,
	...rest
}) => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!interactive || !onClick) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick(e as any);
		}
	};

	return (
		<BadgeWrapper
			as={interactive ? 'button' : 'div'}   
			variant={variant}
			color={color}
			shape={shape}
			size={size}
			$interactive={interactive}
			role={interactive ? 'button' : rest.role}
			tabIndex={interactive ? 0 : rest.tabIndex}
			aria-label={interactive ? ariaLabel : rest['aria-label']}
			onKeyDown={interactive ? handleKeyDown : rest.onKeyDown}
			onClick={(e) => {
				if (interactive) e.preventDefault();
				onClick?.(e as any);
			}}
			{...rest}
		>
			{image && <Image src={image} alt="badge-img" />}
			{icon && <Icon>{icon}</Icon>}
			<Label>{children}</Label>
		</BadgeWrapper>
	);
};

export default Badge;

