import { styled } from '@mui/material/styles';
import mq from '../../../../config/mq';

export const StyledWrapper = styled('div')<{ disabled?: boolean }>(({ theme, disabled }) => ({
	opacity: disabled ? 0.6 : 1,
	width: '100%',
}));

export const StyledLabel = styled('label')(({ theme }) => ({
	fontSize: 14,
	fontWeight: 500,
	marginBottom: theme.spacing(0.5),
	display: 'block',
	color: theme.palette.text.primary,
}));

export const StyledInputContainer = styled('div')<{ error?: boolean; disabled?: boolean }>(({ theme, error, disabled }) => ({
	display: 'flex',
	alignItems: 'center',
	backgroundColor: theme.palette.background.paper,
	border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
	borderRadius: theme.radius.sm4x, // 8px
	padding: theme.spacing(1),
	position: 'relative',
	transition: 'border 0.2s',
	'&:focus-within': {
		borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
	},
	[mq('sm', 'max')]: {
		padding: theme.spacing(0.75),
	},
}));


export const StyledInput = styled('input', {
	shouldForwardProp: (prop) =>
		!['hasLeftIcon', 'hasRightIcon'].includes(prop as string),
})<{
	hasLeftIcon?: boolean;
	hasRightIcon?: boolean;
}>(({ theme, hasLeftIcon, hasRightIcon }) => ({
	width: '100%',
	paddingLeft: hasLeftIcon ? theme.spacing(4) : theme.spacing(2),
	paddingRight: hasRightIcon ? theme.spacing(4) : theme.spacing(2),
	paddingTop: theme.spacing(1.5),
	paddingBottom: theme.spacing(1.5),
	borderRadius: theme.radius.sm4x, // 8px
	fontSize: theme.typography.body1.fontSize,
	resize: 'vertical', // permite resize si es textarea
	'&:focus': {
		outline: 'none',
		borderColor: theme.palette.primary.main,
	},
}));


export const IconContainer = styled('div')<{ position: 'left' | 'right' }>(({ theme, position }) => ({
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	[position]: theme.spacing(1),
	color: theme.palette.text.secondary,
}));

export const StyledHint = styled('p')(({ theme }) => ({
	marginTop: theme.spacing(0.5),
	fontSize: 12,
	color: theme.palette.text.secondary,
}));

export const StyledError = styled(StyledHint)(({ theme }) => ({
	color: theme.palette.error.main,
}));

