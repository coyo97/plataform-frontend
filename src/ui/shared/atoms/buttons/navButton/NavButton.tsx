// shared/atoms/buttons/navButton/NavButton.tsx
import React from 'react';
import { NavButtonProps } from './NavButton.types';
import { StyledNavButton } from './navButton.styles';
import { NavButtonIcon } from './navButton.styles';

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, ...rest }) => {
	return (
		<StyledNavButton active={active} {...rest}>
			{icon && <NavButtonIcon>{icon}</NavButtonIcon>}
			<span>{label}</span>
		</StyledNavButton>
	);
};

export default NavButton;

