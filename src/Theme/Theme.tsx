// src/Theme/Theme.tsx
import React, { ReactNode } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { colors } from './tokens/colors';
import '@fontsource/inter/400.css';
import '@fontsource/allerta-stencil/400.css';
import '@fontsource/quicksand';
import '@fontsource/poppins';
import { shadows as customShadows } from './tokens/shadows';
import { radius } from './tokens/radius';
import { padding } from './tokens/padding';
import { values } from './tokens/values';
import typographyTokens from './tokens/typography';

/* -------------------- Types -------------------- */
declare module '@mui/material/styles' {
	interface Theme {
		customColors: typeof colors;
		radius: typeof radius;
		padding: typeof padding;
		values: typeof values;
		typographyTokens: typeof typographyTokens;
	}
	interface ThemeOptions {
		customColors?: typeof colors;
		radius?: typeof radius;
		padding?: typeof padding;
		values?: typeof values;
		typographyTokens?: typeof typographyTokens;
	}

	type ButtonPalette = {
		background: string;
		hover: string;
		text: string;
	};
	type SelectorPalette = {
		border: string;
		background: string;
		text: string;
		hover: string;
		focus: string;
	};
	interface AccordionPalette {
  border: string;
  background: string;
  summaryText: string;
  detailsBackground: string;
  hover: string;
}


	interface Palette {
		colorHeader: { main: string };
		colorForm: { main: string };
		colorButton: { main: string; second: string };
		sidebar: {
			background: string;
			text: string;
			link: string;
			hover: string;
			accent: string;
		};
		accent: {
			main: string;
			light: string;
			dark: string;
			contrastText: string;
		};
		button: {
			primary: ButtonPalette;
			secondary: ButtonPalette;
			success: ButtonPalette;
			error: ButtonPalette;
			warning: ButtonPalette;
			accent?: ButtonPalette;
		};
		selector: {
			default: SelectorPalette;
			transparent: SelectorPalette;
			filled: SelectorPalette;
			error: SelectorPalette;
			disabled: SelectorPalette;
		};
		  accordion: {
    default: AccordionPalette;
    transparent: AccordionPalette;
  };
	}

	interface PaletteOptions {
		colorHeader?: { main: string };
		colorForm?: { main: string };
		colorButton?: { main: string; second: string };
		sidebar?: {
			background: string;
			text: string;
			link: string;
			hover: string;
			accent: string;
		};
		accent?: {
			main: string;
			light: string;
			dark: string;
			contrastText: string;
		};
		selector?: {
			default: SelectorPalette;
			transparent: SelectorPalette;
			filled: SelectorPalette;
			error: SelectorPalette;
			disabled: SelectorPalette;
		};
		  accordion?: {
    default: AccordionPalette;
    transparent: AccordionPalette;
  };
		button?: Partial<{
			primary: ButtonPalette;
			secondary: ButtonPalette;
			success: ButtonPalette;
			error: ButtonPalette;
			warning: ButtonPalette;
			accent: ButtonPalette;
		}>;
	}

	interface BreakpointOverrides {
		xxs: true;
	}
}

/* -------------------- Theme -------------------- */
const theme = createTheme({
	typography: {
		fontFamily: ['Inter', 'Poppins', 'Allerta Stencil', 'DM Sans', 'Alatsi'].join(','),
	},
	shape: {
		borderRadius: parseInt(radius.sm4x), // 8px como valor base global
	},
	typographyTokens,
	palette: {
		primary: {
			main: colors.brand.secondary[500],   // ✅ Teal → CTA (contrast with violet sidebar)
			light: colors.brand.secondary[300],
			dark: colors.brand.secondary[700],
			contrastText: colors.neutral.white[900],
		},
		secondary: {
			main: colors.brand.tertiary[500],    // ✅ Amber → secondary actions
			light: colors.brand.tertiary[300],
			dark: colors.brand.tertiary[700],
			contrastText: colors.neutral.black[900],
		},
		accent: {
			main: colors.brand.primary[500],     // ✅ Violet → highlight / special
			light: colors.brand.primary[300],
			dark: colors.brand.primary[700],
			contrastText: colors.neutral.white[900],
		},
		success: {
			main: colors.feedback.positive[500],
			light: colors.feedback.positive[300],
			dark: colors.feedback.positive[700],
			contrastText: colors.neutral.white[900],
		},
		error: {
			main: colors.feedback.negative[500],
			light: colors.feedback.negative[300],
			dark: colors.feedback.negative[700],
			contrastText: colors.neutral.white[900],
		},
		warning: {
			main: colors.feedback.warning[500],
			light: colors.feedback.warning[300],
			dark: colors.feedback.warning[700],
			contrastText: colors.neutral.black[900],
		},

		background: {
			default: colors.neutral.graySoft[50],  // page bg
			paper: colors.neutral.white[900],      // cards/surfaces
		},
		text: {
			primary: colors.neutral.graySoft[900],
			secondary: colors.neutral.graySoft[600],
		}, colorHeader: {
			main: colors.brand.primary[600],
		},
		colorForm: {
			main: colors.neutral.graySoft[50],
		},
		colorButton: {
			main: colors.brand.secondary[500],     // sync with new primary
			second: colors.brand.tertiary[500],    // sync with new secondary
		},
		sidebar: {
			background: colors.neutral.grayStrongDark[900],
			text: colors.neutral.graySoft[100],
			link: colors.brand.primary[300],
			hover: colors.brand.primary[400],
			accent: colors.brand.secondary[400],
		},

		// 🎨 Centralized button tokens
		button: {
			primary: {
				background: colors.brand.secondary[500],
				hover: colors.brand.secondary[600],
				text: colors.neutral.white[900],
			},
			secondary: {
				background: colors.brand.tertiary[500],
				hover: colors.brand.tertiary[600],
				text: colors.neutral.black[900],
			},
			accent: {
				background: colors.brand.primary[500],
				hover: colors.brand.primary[600],
				text: colors.neutral.white[900],
			},
			success: {
				background: colors.feedback.positive[500],
				hover: colors.feedback.positive[700],
				text: colors.neutral.white[900],
			},
			error: {
				background: colors.feedback.negative[500],
				hover: colors.feedback.negative[700],
				text: colors.neutral.white[900],
			},
			warning: {
				background: colors.feedback.warning[500],
				hover: colors.feedback.warning[700],
				text: colors.neutral.black[900],
			},
		},
		selector: {
			default: {
				border: colors.neutral.graySoft[300],
				background: colors.neutral.white[900],
				text: colors.neutral.graySoft[900],
				hover: colors.neutral.graySoft[100],
				focus: colors.brand.primary[300],
			},
			transparent: {
				border: colors.brand.secondary[400],
				background: 'transparent',
				text: colors.neutral.white[900],
				hover: 'rgba(255,255,255,0.08)',
				focus: colors.brand.secondary[300],
			},
			filled: { // 🔥 new variant
				border: 'none',
				background: colors.brand.primary[500],
				text: colors.neutral.white[900],
				hover: colors.brand.primary[600],
				focus: colors.brand.primary[300],
			},
			error: {
				border: colors.feedback.negative[500],
				background: colors.neutral.white[900],
				text: colors.feedback.negative[700],
				hover: colors.feedback.negative[100],
				focus: colors.feedback.negative[300],
			},
			disabled: {
				border: colors.neutral.graySoft[200],
				background: colors.neutral.graySoft[50],
				text: colors.neutral.graySoft[400],
				hover: colors.neutral.graySoft[50],   // stays same on hover
				focus: colors.neutral.graySoft[200],  // subtle focus
			},
		},
		accordion: {
  default: {
    border: colors.neutral.graySoft[300],
    background: colors.neutral.white[900],
    summaryText: colors.neutral.graySoft[900],
    detailsBackground: colors.neutral.graySoft[50],
    hover: colors.neutral.graySoft[100],
  },
  transparent: {
    border: colors.brand.secondary[400],      // teal border
    background: 'transparent',
    summaryText: colors.uatf.yellow,          // gold text
    detailsBackground: 'transparent',
    hover: 'rgba(255, 255, 255, 0.08)',
  },
},

		divider: colors.neutral.graySoft[200],
		action: {
			hover: colors.neutral.graySoft[100],
		},
	},

	customColors: colors,
	breakpoints: {
		values: {
			xxs: 0,
			xs: 375,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1800,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: { fontFamily: 'Poppins, sans-serif' },
				'h1, h2, h3, h4, h5, h6': { margin: 0, padding: 0 },
			},
		},
	},

	shadows: [
		'none',
		customShadows.xs,   // 1
		customShadows.sm,   // 2
		customShadows.md,   // 3
		customShadows.lg,   // 4
		customShadows.xl,   // 5
		customShadows.x3l,  // 6
		'none', // 7
		'none', // 8
		'none', // 9
		'none', // 10
		'none', // 11
		'none', // 12
		'none', // 13
		'none', // 14
		'none', // 15
		'none', // 16
		'none', // 17
		'none', // 18
		'none', // 19
		'none', // 20
		'none', // 21
		'none', // 22
		'none', // 23
		'none', // 24
	],
});

type ThemeProps = {
	children: ReactNode;
};

const Theme: React.FC<ThemeProps> = ({ children }) => (
	<ThemeProvider theme={theme}>
		<CssBaseline />
		{children}
	</ThemeProvider>
);
theme.radius = radius;
theme.padding = padding;
theme.values = values;
theme.typographyTokens = typographyTokens;

export default Theme;
export { theme };

