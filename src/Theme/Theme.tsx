// src/Theme/Theme.tsx
import React, { ReactNode } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { colors } from './tokens/colors'; // asegúrate que esté bien exportado
import '@fontsource/inter/400.css';
import '@fontsource/allerta-stencil/400.css';
import '@fontsource/quicksand';
import '@fontsource/poppins';
import { shadows as customShadows } from './tokens/shadows';
import { radius } from './tokens/radius';
import { padding } from './tokens/padding';
import { values } from './tokens/values';
import typographyTokens from './tokens/typography';

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
	}

	interface BreakpointOverrides {
		xxs: true;
	}
}

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
			main: colors.brand.primary[700],
			light: colors.brand.primary[300],
			dark: colors.brand.primary[900],
			contrastText: colors.neutral.white[900],
		},
		secondary: {
			main: colors.feedback.negative[500],
			light: colors.feedback.negative[300],
			dark: colors.feedback.negative[700],
			contrastText: colors.neutral.white[900],
		},
		warning: {
			main: colors.feedback.warning[500],
			contrastText: colors.neutral.black[900],
		},
		background: {
			default: colors.neutral.white[900],
			paper: colors.neutral.graySoft[50],
		},
		text: {
			primary: colors.neutral.black[900],
			secondary: colors.brand.primary[700],
		},
		colorHeader: {
			main: colors.brand.primary[700],
		},
		colorForm: {
			main: colors.neutral.graySoft[50],
		},
		colorButton: {
			main: colors.brand.primary[700],
			second: colors.feedback.negative[500],
		},
		sidebar: {
			background: colors.brand.primary[700],
			text: colors.neutral.white[900],
			link: colors.feedback.warning[500],
			hover: colors.feedback.negative[300],
			accent: colors.feedback.warning[500],
		},
		divider: colors.neutral.graySoft[200],
		action: {
			hover: colors.neutral.graySoft[100],
		},
	},
	customColors: colors, // Aquí se agregan los tokens completos
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
				body: {
					fontFamily: 'Poppins, sans-serif',
				},
				'h1, h2, h3, h4, h5, h6': {
					margin: 0,
					padding: 0,
				},
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

