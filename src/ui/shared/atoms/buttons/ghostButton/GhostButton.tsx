import React from 'react';
import { StyledGhostButton } from './ghostButton.styles';
import { GhostButtonProps } from './GhostButton.types';

const GhostButton: React.FC<GhostButtonProps> = ({ label, colorType = 'primary', ...rest }) => {
	return (
		<StyledGhostButton colorType={colorType} {...rest}>
			{label}
		</StyledGhostButton>
	);
};

export default GhostButton;


