import { styled } from '@mui/material/styles';
import { radius } from '../../../../Theme/tokens/radius';
import mq from '../../../../config/mq';

export const CardRoot = styled('article')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	background: theme.palette.background.paper,
	color: theme.palette.text.primary,
	borderRadius: radius.sm4x,
	boxShadow: theme.shadows[1],
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
	transition: 'box-shadow 0.2s ease',
	'&:hover': { boxShadow: theme.shadows[3] },

	// ====== RESPONSIVE ======
	[mq('sm', 'max')]: {
		padding: theme.spacing(1.5),
		marginBottom: theme.spacing(1.5),
	},
	[mq('xs', 'max')]: {
		padding: theme.spacing(1.25),
		marginBottom: theme.spacing(1.25),
	},
}));

export const Header = styled('header')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginBottom: theme.spacing(1),

	[mq('sm', 'max')]: { marginBottom: theme.spacing(0.75) },
	[mq('xs', 'max')]: { marginBottom: theme.spacing(0.5) },
}));

export const AuthorInfo = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
	cursor: 'pointer',
}));

export const Content = styled('section')(({ theme }) => ({
	marginBottom: theme.spacing(2),
	'& strong': {
		display: 'block',
		marginBottom: theme.spacing(0.5),
	},

	[mq('sm', 'max')]: { marginBottom: theme.spacing(1.5) },
	[mq('xs', 'max')]: { marginBottom: theme.spacing(1) },
}));

export const TagsWrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	flexWrap: 'wrap',
	gap: theme.spacing(0.5),
}));

export const MediaWrapper = styled('div')(({ theme }) => ({
	marginTop: theme.spacing(1),
	borderRadius: radius.sm2x,
	overflow: 'hidden',
	maxHeight: 'min(60vh, 520px)',
	position: 'relative',

	'& img, & video, & picture': {
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},

	// baja altura máxima en pantallas pequeñas
	[mq('sm', 'max')]: { maxHeight: '50vh' },
	[mq('xs', 'max')]: { maxHeight: '45vh' },
}));

export const Footer = styled('footer')(({ theme }) => ({
	marginTop: theme.spacing(1),
	borderTop: `1px solid ${theme.palette.divider}`,
	paddingTop: theme.spacing(1),

	[mq('xs', 'max')]: {
		marginTop: theme.spacing(0.75),
		paddingTop: theme.spacing(0.75),
	},
}));

