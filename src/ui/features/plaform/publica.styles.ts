import { styled } from '@mui/system';

export const MainContent = styled('div')(({ theme }) => ({
  paddingTop: '60px', // Asegúrate de que coincida con la altura del Header
  minHeight: '100vh', // Asegura que ocupe toda la pantalla
  backgroundColor: theme.palette.primary.light, // Color de fondo opcional
}));

