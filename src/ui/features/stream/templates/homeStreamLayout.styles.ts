import { Theme } from '@mui/material';
import mq from '../../../../config/mq';

export const styles = {
	/* Header de la parte superior */
	headerBox: (theme: Theme) => ({
		width: '100%',
		bgcolor: theme.customColors.uatf.red,
		py: theme.padding.px6,
		px: theme.padding.px10,
		boxShadow: theme.shadows[10],

		/* Ejemplo responsive: hasta “md” se reduce el padding */
		[mq('md', 'max')]: {
			px: theme.padding.px4,
			py: theme.padding.px4,
		},
	}),

	headerTitle: (theme: Theme) => ({
		fontFamily: `'Allerta Stencil', serif`,
		color: theme.customColors.neutral.white[900],
		fontSize: theme.typographyTokens.display.lg.monospace,

		/* Más pequeño en móviles */
		[mq('sm', 'max')]: {
			fontSize: theme.typographyTokens.display.xl.sans
		},
	}),

	/* Contenedor central donde van lista o children */
	contentBox: (theme: Theme) => ({
		flex: 1,
		px: theme.padding.px10,
		py: theme.padding.px6,

		[mq('sm', 'max')]: {
			px: theme.padding.px4,
			py: theme.padding.px4,
		},
	}),

	/* Select de filtros de lista */
	formControl: (theme: Theme) => ({
		minWidth: 160,
		mb: theme.padding.px6,
	}),
	headerInner: {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
},

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
    display: 'none', // solo se muestra en pantallas pequeñas
  },
}),
};

