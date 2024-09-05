import React, { ReactNode } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import Inter from '../assets/fonts/Inter-Regular.ttf';
import Poppins from '../assets/fonts/Poppins-Regular.ttf';
import AllertaStencil from '../assets/fonts/AllertaStencil-Regular.ttf';
import DMSans from '../assets/fonts/DMSans-Regular.ttf'; 
import Alatsi from '../assets/fonts/Alatsi-Regular.ttf';
import '@fontsource/inter/400.css';
import '@fontsource/allerta-stencil/400.css';
import '@fontsource/quicksand';
import '@fontsource/poppins';

const InterRegular = {
	fontFamily: "Inter-Regular",
	fontStyle: "normal",
	fontWeight: 100,
	src: `url(${Inter})`,
};
const InterBold = {
	fontFamily: "Inter-Bold",
	fontStyle: "normal",
	fontWeight: 700,
	src: `url(${Inter})`,
};
const PoppinsRegular = {
	fontFamily: "Poppins-Regular",
	fontStyle: "normal",
	fontWeight: 100,
	src: `url(${Poppins})`,
};
const PoppinsBold = {
	fontFamily: "Poppins-Bold",
	fontStyle: "normal",
	fontWeight: 700,
	src: `url(${Poppins})`,
};
const AllertaStencilRegular = {
	fontFamily: 'AllertaStencil-Regular',
	fontStyle: 'normal',
	fontWeight: 100,
	src: `url(${AllertaStencil})`,
};
const AllertaStencilBold = {
	fontFamily: 'AllertaStencil-Bold',
	fontStyle: 'normal',
	fontWeight: 700,
	src: `url(${AllertaStencil})`,
};
const DMSansRegular ={
	fontFamily: 'DMSans-Regular',
fontStyle: 'normal',
fontWeight: 100,
src: `url(${DMSans})`
};
const AlatsiRegular = {
	fontFamily: 'Alatsi-Regular',
	fontStyle: 'normal',
	fontWeight: 100,
	src: `url(${Alatsi})`
};
const AlatsiBold = {
	fontFamily: 'Alatsi-Bold',
	fontStyle: 'normal',
	fontWeight: 700,
	src: `url(${Alatsi})`
};

declare module '@mui/material/styles/createPalette' {
	interface Palette {
		colorHeader: {main: string};
	}
	interface PaletteOptions {
		colorHeader?: {main: string};
	}
}
declare module '@mui/material/styles/createPalette' {
	interface Palette {
		colorForm: {main: string};
	}
	interface PaletteOptions {
		colorForm?: {main: string};
	}
}

declare module '@mui/material/styles/createPalette' {
	interface Palette {
		colorButton: {main: string, second: string};
	}
	interface PaletteOptions {
		colorButton?: {main: string, second: string};
	}
}

const theme = createTheme({
	typography: { fontFamily: [ InterRegular.fontFamily, InterBold.fontFamily,
		PoppinsRegular.fontFamily,
		PoppinsBold.fontFamily,
		AllertaStencilRegular.fontFamily,
		AllertaStencilBold.fontFamily,
		DMSansRegular.fontFamily, 
		AlatsiRegular.fontFamily, 
		AlatsiBold.fontFamily
	].join(","),
	},
	palette: {
		primary: {
			main: "#FFFFFF",
			light: "#F1F0F0",
			dark: "#898C81",
			contrastText: "#FD3939",
		},
		secondary: {
			main: '#333',
		},
		colorHeader: {
			main: '#666666'
		},
		colorForm: {
			main: '#222831'
		},
		colorButton: {
			main: '#09A4AB',
			second: '#76ff03',
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				'@global': {
					'@font-face': [PoppinsRegular, PoppinsBold, InterRegular, InterBold, AllertaStencilRegular, AllertaStencilBold, DMSansRegular, AlatsiRegular, AlatsiBold],
				},
				body: {
					fontFamily: ["PoppinsRegular"],
				},
				"h1, h2, h3, h4, h5, h6": {
					margin: 0,
					padding: 0,
				},
			},
		}
	}
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

export default Theme;

