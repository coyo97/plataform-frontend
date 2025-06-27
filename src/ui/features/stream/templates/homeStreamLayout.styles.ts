/* homeStreamLayout.styles.ts */
import { Theme } from '@mui/material';
import mq from '../../../../config/mq';

export const styles = {
	headerBox: (theme: Theme) => ({
		width: '100%',
		bgcolor: theme.customColors.uatf.red,
		/* desktop */
		py: theme.spacing(2),   // ≈ 16 px
		px: theme.spacing(5),   // ≈ 40 px
		boxShadow: theme.shadows[10],

		/* móvil ⇒ padding mucho más fino */
		[mq('sm', 'max')]: {
			py: theme.spacing(1), // ≈ 8 px
			px: theme.spacing(3), // ≈ 24 px
		},
	}),

	headerInner: (theme: Theme) => ({
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(2),

		[mq('sm', 'max')]: {
			gap: theme.spacing(1),   // reduce la separación
			flexWrap: 'wrap',
			justifyContent: 'center',
		},
	}),

	headerTitle: (theme: Theme) => ({
		fontFamily: `'Allerta Stencil', serif`,
		color: theme.customColors.neutral.white[900],
		margin: 0,
		flex: 1,
		fontSize: theme.typographyTokens.display.lg.monospace,
		lineHeight: 1.1,           // compáctalo un poco

		[mq('sm', 'max')]: {
			fontSize: theme.typographyTokens.display.xl.sans,
			textAlign: 'center',
			flexBasis: '100%',
			lineHeight: 1.1,
		},
	}),

	menuButton: (theme: Theme) => ({
		background: 'transparent',
		border: 'none',
		cursor: 'pointer',
		color: theme.customColors.neutral.white[900],
		padding: 4,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		[mq('md', 'min')]: {
			display: 'none', // oculto en ≥900 px
		},
	}),

	/* ───────── CONTENIDO CENTRAL ───────── */
	contentBox: (theme: Theme) => ({
		flex: 1,
		px: theme.padding.px10,
		py: theme.padding.px6,

		[mq('sm', 'max')]: {
			px: theme.padding.px4,
			py: theme.padding.px4,
		},
	}),

	/* Select de filtros */
	formControl: (theme: Theme) => ({
		minWidth: 160,
		mb: theme.padding.px6,
	}),
};

