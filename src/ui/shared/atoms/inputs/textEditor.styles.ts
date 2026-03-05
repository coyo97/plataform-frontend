// src/ui/shared/atoms/inputs/textEditor.styles.ts
import { styled } from '@mui/material/styles';
import mq from '../../../../config/mq';

import {
	StyledWrapper as BaseWrapper,
	StyledLabel as BaseLabel,
	StyledInputContainer as BaseInputContainer,
	IconContainer as BaseIconContainer,
	StyledHint as BaseHint,
	StyledError as BaseError,
} from './mainInput.styles';

export const StyledWrapper = BaseWrapper;
export const StyledLabel = BaseLabel;
export const IconContainer = BaseIconContainer;
export const StyledHint = BaseHint;
export const StyledError = BaseError;

export const StyledInputContainer = styled(BaseInputContainer)(({ theme }) => ({
	flexDirection: 'column',
	alignItems: 'stretch',
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1),
}));

export const StyledToolbar = styled('div')(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(1),
	marginBottom: theme.spacing(1),
	borderBottom: `1px solid ${theme.palette.divider}`,
	paddingBottom: theme.spacing(0.5),
}));

export const ToolbarButton = styled('button')<{
	active?: boolean;
}>(({ theme, active }) => ({
	border: 'none',
	backgroundColor: active ? theme.palette.action.selected : 'transparent',
	cursor: 'pointer',
	padding: `${theme.spacing(0.25)} ${theme.spacing(0.75)}`,
	borderRadius: theme.radius.md2x || 4,
	fontSize: 12,
	fontWeight: 600,
	color: active ? theme.palette.text.primary : theme.palette.text.secondary,
	'&:hover': {
		backgroundColor: active
			? theme.palette.action.selected
			: theme.palette.action.hover,
		color: theme.palette.text.primary,
	},
	'&:disabled': {
		opacity: 0.5,
		cursor: 'not-allowed',
	},
}));

export const StyledEditor = styled('div', {
	shouldForwardProp: (prop) =>
		!['hasLeftIcon', 'hasRightIcon'].includes(prop as string),
})<{
	hasLeftIcon?: boolean;
	hasRightIcon?: boolean;
}>(({ theme, hasLeftIcon, hasRightIcon }) => ({
	width: '100%',
	paddingLeft: hasLeftIcon ? theme.spacing(4) : theme.spacing(2),
	paddingRight: hasRightIcon ? theme.spacing(4) : theme.spacing(2),
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1),
	borderRadius: theme.radius.sm4x,
	fontSize: theme.typography.body1.fontSize,
	lineHeight: 1.5,
	outline: 'none',
	overflowY: 'auto',
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-word',

	direction: 'ltr',
	unicodeBidi: 'plaintext',

	[mq('sm', 'max')]: {
		paddingLeft: hasLeftIcon ? theme.spacing(4) : theme.spacing(1.5),
		paddingRight: hasRightIcon ? theme.spacing(4) : theme.spacing(1.5),
	},

	'&[data-placeholder]:empty:before': {
		content: 'attr(data-placeholder)',
		color: theme.palette.text.disabled,
		pointerEvents: 'none',
	},

	'&:focus': {
		outline: 'none',
	},

	'& b, & strong': {
		fontWeight: 700,
	},
	'& i, & em': {
		fontStyle: 'italic',
	},
	'& u': {
		textDecoration: 'underline',
	},
}));

