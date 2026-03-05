import React from 'react';
import { StyledIconButton } from './iconButton.styles';
import { IconButtonProps } from './IconButton.types';

const IconButton: React.FC<IconButtonProps> = ({
	children,
	ariaLabel,
	colorType = 'primary',
	sizeType = 'md',
	shape = 'rounded',
	href, 
	...rest
}) => {
	const extraProps = href
		? { component: 'a', href }
		: {};

	return (
		<StyledIconButton
			colorType={colorType}
			sizeType={sizeType}
			shape={shape}
			aria-label={ariaLabel}
			{...extraProps}
			{...rest}
		>
			{children}
		</StyledIconButton>
	);
};

export default IconButton;

