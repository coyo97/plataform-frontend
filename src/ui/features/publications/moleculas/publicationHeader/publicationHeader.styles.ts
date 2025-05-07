// ui/features/publications/molecules/PublicationHeader/publicationHeader.styles.ts
import { styled } from '@mui/material/styles';
import { CardHeader } from '@mui/material';

/*  ⬇︎  Solo estilos: el mismo CardHeader “envuelto” con ajustes responsivos */
export const StyledHeader = styled(CardHeader)(({ theme }) => ({
	paddingInline: theme.spacing(2),

	/* Avatar ─────────────────────────────────────────────── */
	'& .MuiCardHeader-avatar': {
		width : 44,
		height: 44,
		[theme.breakpoints.down('sm')]: { width: 36, height: 36 },
	},

	/* Título ─────────────────────────────────────────────── */
	'& .MuiCardHeader-title': {
		fontWeight: 600,
		fontSize  : '1.1rem',
		lineHeight: 1.25,
		[theme.breakpoints.down('sm')]: { fontSize: '1rem' },
	},

	/* Sub‑título (autor) ─────────────────────────────────── */
	'& .MuiCardHeader-subheader': {
		fontSize: '0.85rem',
		color   : theme.palette.text.secondary,
		[theme.breakpoints.down('sm')]: { fontSize: '0.75rem' },
	},
}));

