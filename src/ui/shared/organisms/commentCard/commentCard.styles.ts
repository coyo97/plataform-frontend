// src/ui/shared/organisms/commentCard/commentCard.styles.ts
import { styled } from '@mui/material/styles';
import { radius } from '../../../../Theme/tokens/radius';
import mq from '../../../../config/mq';

export const CommentRoot = styled('article')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	background: theme.palette.background.paper,
	color: theme.palette.text.primary,
	borderRadius: radius.sm4x,
	boxShadow: theme.shadows[1],
	padding: theme.spacing(2),
	marginBottom: theme.spacing(1.5),
	transition: 'box-shadow 0.2s ease',
	'&:hover': {
		boxShadow: theme.shadows[3],
	},

	[mq('sm', 'max')]: {
		padding: theme.spacing(1.5),
		marginBottom: theme.spacing(1.25),
	},
	[mq('xs', 'max')]: {
		padding: theme.spacing(1.25),
		marginBottom: theme.spacing(1),
	},
}));

export const CommentHeader = styled('header')(({ theme }) => ({
	display: 'flex',
	alignItems: 'flex-start',
	justifyContent: 'space-between',
	gap: theme.spacing(1),
	marginBottom: theme.spacing(1),

	[mq('sm', 'max')]: {
		marginBottom: theme.spacing(0.75),
	},
	[mq('xs', 'max')]: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: theme.spacing(0.5),
	},
}));

export const AuthorBlock = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'flex-start',
	gap: theme.spacing(1),
}));

export const AuthorMeta = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	minWidth: 0,
	'& > *': {
		lineHeight: 1.3,
	},
}));

export const CommentBody = styled('section')(({ theme }) => ({
	marginBottom: theme.spacing(1.5),
	wordBreak: 'break-word',
	[mq('sm', 'max')]: {
		marginBottom: theme.spacing(1.25),
	},
	[mq('xs', 'max')]: {
		marginBottom: theme.spacing(1),
	},
}));

export const CommentFooter = styled('footer')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: theme.spacing(1),
	flexWrap: 'wrap',
}));

