import { IconButtonProps as MUIIconButtonProps } from '@mui/material';
import { ButtonColorType, ButtonShape } from '../button.types';
import { LinkProps } from 'react-router-dom';

export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<MUIIconButtonProps, 'color'> {
	colorType?: ButtonColorType;
	sizeType?: IconButtonSize;
	shape?: ButtonShape;
	ariaLabel: string;
	href?: string; //
	to?: LinkProps['to'];
}

