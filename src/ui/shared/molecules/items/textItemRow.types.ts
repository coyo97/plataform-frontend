import { LinkProps } from 'react-router-dom';
import { SxProps, Theme } from '@mui/material/styles';
import React from 'react';
export type TextItemRowSize = 'sm' | 'md' | 'lg';
export interface TextItemRowProps {
	icon?: React.ReactElement;
	label: string | React.ReactNode;
	description?: string | React.ReactNode;
	meta?: React.ReactNode;
	selected?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	href?: string;
	to?: LinkProps['to'];
	size?: TextItemRowSize;
	sx?: SxProps<Theme>;
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
}
