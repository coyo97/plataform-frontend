import { styled } from '@mui/material/styles';
import mq from '../../../../config/mq';

interface StyleProps {
	error: boolean;
	disabled: boolean;
	size: 'small' | 'medium' | 'large';
}

interface InputProps {
	error: boolean;
	disabled: boolean;
	hasLeftIcon: boolean;
	hasRightIcon: boolean;
}

export const StyledTextFieldWrapper = styled('div')<StyleProps>(({ theme, error, disabled, size }) => {
	const getPadding = () => {
		switch (size) {
			case 'small': return theme.spacing(1);
			case 'large': return theme.spacing(2);
			default: return theme.spacing(1.5);
		}
	};

	return {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(0.5),
		opacity: disabled ? 0.6 : 1,
		color: error ? theme.palette.error.main : theme.palette.text.primary,
		[mq('sm', 'max')]: {
			fontSize: '0.9rem',
		},
		paddingBottom: theme.spacing(1),
	};
});

export const StyledInput = styled('input')<InputProps>(({ theme, error, disabled, hasLeftIcon, hasRightIcon }) => ({
	width: '100%',
	padding: theme.spacing(1.5),
	paddingLeft: hasLeftIcon ? theme.spacing(5) : theme.spacing(1.5),
	paddingRight: hasRightIcon ? theme.spacing(5) : theme.spacing(1.5),
	border: `1px solid ${error ? theme.palette.error.main : theme.palette.grey[400]}`,
	borderRadius: theme.radius.sm4x, //  Token de radius
	outline: 'none',
	fontSize: '1rem',
	color: theme.palette.text.primary,
	backgroundColor: disabled ? theme.palette.action.disabledBackground : '#fff',
	transition: 'border 0.2s ease-in-out',
	'&:focus': {
		borderColor: theme.palette.primary.main,
		boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
	},
	'&:disabled': {
		cursor: 'not-allowed',
	},
	[mq('sm', 'max')]: {
		padding: theme.spacing(1),
		fontSize: '0.9rem',
	},
}));


export const Label = styled('label')(({ theme }) => ({
	fontSize: '0.875rem',
	color: theme.palette.text.secondary,
	fontWeight: 500,
}));

export const HelperText = styled('span')<{ error: boolean }>(({ theme, error }) => ({
	fontSize: '0.75rem',
	color: error ? theme.palette.error.main : theme.palette.text.secondary,
	marginTop: theme.spacing(0.25),
}));

export const IconWrapper = styled('div')<{ position: 'left' | 'right' }>(({ theme, position }) => ({
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	[potionToStyle(position)]: theme.spacing(1.5),
	pointerEvents: 'none',
	color: theme.palette.text.secondary,
}));
export const EndAdornment = styled('div')(({ theme }) => ({
	position: 'absolute',
	top: '50%',
	right: theme.spacing(1),
	transform: 'translateY(-50%)',
	pointerEvents: 'auto',
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(0.5),
}));
export const Counter = styled('span')(({ theme }) => ({
	marginLeft: 'auto',
	fontSize: '0.75rem',
	color: theme.palette.text.disabled,
}));
// Helper para posición
const potionToStyle = (position: 'left' | 'right') =>
	position === 'left' ? 'left' : 'right';

