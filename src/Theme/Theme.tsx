import React, { ReactNode } from 'react';
import { PaletteOptions } from '@mui/material/styles';
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
    colorHeader: { main: string };
    colorForm: { main: string };
    colorButton: { main: string; second: string };
  }
  interface PaletteOptions {
    colorHeader?: { main: string };
    colorForm?: { main: string };
    colorButton?: { main: string; second: string };
  }
}
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxs: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    sidebar: {
      background: string;
      text: string;
      link: string;
      hover: string;
      accent: string;
    };
  }

  interface PaletteOptions {
    sidebar?: {
      background: string;
      text: string;
      link: string;
      hover: string;
      accent: string;
    };
  }
}

const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
      'Poppins',
      'Allerta Stencil',
      'DM Sans',
      'Alatsi',
    ].join(","),
  },
  palette: {
    primary: {
      main: '#003366', // Azul oscuro
      light: '#336699', // Azul intermedio
      dark: '#002244',  // Azul más oscuro
      contrastText: '#FFFFFF', // Texto blanco sobre fondo azul
    },
    secondary: {
      main: '#CC0000', // Rojo
      light: '#FF3333', // Rojo claro
      dark: '#990000',  // Rojo oscuro
      contrastText: '#FFFFFF', // Texto blanco sobre fondo rojo
    },
    warning: {
      main: '#FFD700', // Amarillo dorado
      contrastText: '#000000', // Texto negro sobre fondo amarillo
    },
    background: {
      default: '#FFFFFF', // Blanco
      paper: '#F5F5F5', // Gris claro para fondos secundarios
    },
    text: {
      primary: '#000000', // Negro
      secondary: '#003366', // Azul oscuro para textos secundarios
    },
    colorHeader: {
      main: '#003366', // Azul oscuro para encabezados
    },
    colorForm: {
      main: '#F5F5F5', // Gris claro para fondos de formularios
    },
    colorButton: {
      main: '#003366', // Azul oscuro para botones principales
      second: '#CC0000', // Rojo para botones secundarios
    },
    sidebar: {
      background: '#003366',  // Fondo azul oscuro del sidebar
      text: '#FFFFFF',        // Texto blanco
      link: '#FFD700',        // Enlaces en amarillo
      hover: '#FF3333',       // Rojo claro al hacer hover
      accent: '#FFD700',      // Amarillo/dorado como acento
    },
    divider: '#CCCCCC', // Gris para divisores
    action: {
      hover: '#E6F2FF', // Azul muy claro al pasar el cursor
    },
  },
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
          fontFamily: "Poppins, sans-serif",
        },
        "h1, h2, h3, h4, h5, h6": {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
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
export { theme };
