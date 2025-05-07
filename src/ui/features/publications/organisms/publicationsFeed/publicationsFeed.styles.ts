// ui/features/publications/organisms/publicationsFeed/publicationsFeed.styles.ts
import { styled, keyframes } from '@mui/material/styles';

/* Pequeña animación de entrada */
const fadeSlide = keyframes`
from { opacity:0; transform:translateY(8px); }
to   { opacity:1; transform:translateY(0);   }
`;

/**
 * Zona central del feed
 * – En desktop ocupa toda la columna central del grid (layout ya lo gestiona)
 * – En tablet añade un margen horizontal para “respirar”
 * – En mobile estira al 100 %
 */
export const FeedWrapper = styled('section')(({ theme }) => ({
	flex: 1,
	minWidth: 0,          // evita que se encoja dentro del grid
	animation: `${fadeSlide} .4s ease`,

	/* Spacing horizontal */
	marginLeft : theme.spacing(3),
	marginRight: theme.spacing(1),

	[theme.breakpoints.down('md')]: {
		marginInline: theme.spacing(1.5),
	},
	[theme.breakpoints.down('sm')]: {
		marginInline: 0,
	},

	/* Espaciado entre tarjetas */
	'& > div:not(:last-of-type)': {
		marginBottom: theme.spacing(3),
	},
}));

