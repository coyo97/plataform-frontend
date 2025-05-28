import React from 'react';
import { AlertProps } from './Alert.types';
import { StyledAlert } from './alert.styles';

const Alert: React.FC<AlertProps> = ({
	children,
	type = 'info',
	variant = 'standard',
}) => (
	<StyledAlert severity={type} variant={variant}>
		{children}
	</StyledAlert>
);

export default Alert;

