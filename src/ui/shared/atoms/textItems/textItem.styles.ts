import { styled } from '@mui/material/styles';
import mq from '../../../../config/mq';
import { TextItemProps } from './textItem.types';

const getBackground = (variant: TextItemProps['variant'], theme: any) => {
	switch (variant) {
		case 'warning':
			return theme.palette.warning.light;
		case 'error':
			return theme.palette.error.light;
		case 'info':
			return theme.palette.info.light;
		default:
			return theme.palette.background.paper;
	}
};

export const TextItemWrapper = styled('div')<{
	variant: TextItemProps['variant'];
	disabled?: boolean;
}>(({ theme, variant, disabled }) => ({
	width: '100%',
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
	borderRadius: theme.shape.borderRadius,
	backgroundColor: getBackground(variant, theme),
	opacity: disabled ? 0.6 : 1,
	[ mq('xs', 'max') ]: {
		padding: theme.spacing(1.5),
	},
}));

export const UsernameText = styled('span')(({ theme }) => ({
	display: 'block',
	fontWeight: 600,
	fontSize: '1rem',
	marginBottom: theme.spacing(1),
	color: theme.palette.text.primary,
}));

export const TextItemContent = styled('p')(({ theme }) => ({
	fontSize: '0.875rem',
	lineHeight: 1.5,
	color: theme.palette.text.secondary,
	margin: 0,
}));

