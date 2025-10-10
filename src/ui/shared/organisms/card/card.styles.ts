import { styled } from '@mui/material/styles';
import { radius } from '../../../../Theme/tokens/radius';

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
	'&:hover': {
		boxShadow: theme.shadows[3],
	},
}));

export const Header = styled('header')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginBottom: theme.spacing(1),
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
}));

export const TagsWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5), // 4px entre chips
}));

export const MediaWrapper = styled('div')(({ theme }) => ({
	marginTop: theme.spacing(1),
	borderRadius: radius.sm2x,
	overflow: 'hidden',

	maxHeight: 'min(60vh, 520px)',

	// aseguro que las imágenes/videos no desborden
	position: 'relative',

	// si dentro hay <img> / <video>, que se adapten al wrapper
	'& img, & video, & picture': {
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'cover', // recorte sutil en feed; la versión completa la verás en el lightbox
	},

	// en pantallas pequeñas, baja el límite un poco
	[theme.breakpoints.down('sm')]: {
		maxHeight: '50vh',
	},
}));


export const Footer = styled('footer')(({ theme }) => ({
	marginTop: theme.spacing(1),
	borderTop: `1px solid ${theme.palette.divider}`,
	paddingTop: theme.spacing(1),
}));

