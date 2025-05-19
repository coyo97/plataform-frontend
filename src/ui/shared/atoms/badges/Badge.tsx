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
	children,
	...rest
}) => {
	return (
		<BadgeWrapper
			variant={variant}
			color={color}
			shape={shape}
			size={size}
			{...rest}
		>
			{image && <Image src={image} alt="badge-img" />}
			{icon && <Icon>{icon}</Icon>}
			<Label>{children}</Label>
		</BadgeWrapper>
	);
};

export default Badge;

