import { styled } from '@mui/material/styles';
import { CheckProps } from './check.types';

export const CheckWrapper = styled('div')<{ disabled?: boolean }>(({ theme, disabled }) => ({
	display: 'flex',
	alignItems: 'center',
	cursor: disabled ? 'not-allowed' : 'pointer',
	opacity: disabled ? 0.6 : 1,
	userSelect: 'none',
}));

const getColor = (variant: CheckProps['variant'], theme: any) => {
	switch (variant) {
		case 'success':
			return theme.palette.success.main;
		case 'info':
			return theme.palette.info.main;
		case 'warning':
			return theme.palette.warning.main;
		case 'danger':
			return theme.palette.error.main;
		default:
			return theme.palette.primary.main;
	}
};

export const BoxVisual = styled('div')<{
	checked: boolean;
	disabled?: boolean;
	variant: CheckProps['variant'];
}>(({ theme, checked, disabled, variant }) => ({
	width: 20,
	height: 20,
	borderRadius: 4,
	border: `2px solid ${checked ? getColor(variant, theme) : theme.palette.grey[400]}`,
	backgroundColor: checked ? getColor(variant, theme) : theme.palette.background.paper,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	transition: 'all 0.2s ease-in-out',
}));

export const CheckMark = styled('div')(({ theme }) => ({
	width: 10,
	height: 10,
	backgroundColor: theme.palette.common.white,
	borderRadius: 2,
}));

export const StyledLabel = styled('span')<{ disabled?: boolean }>(({ theme, disabled }) => ({
	marginLeft: theme.spacing(1),
	color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
	fontSize: 14,
}));

