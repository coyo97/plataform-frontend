import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Grid } from '@mui/material';
import mq from '../../../config/mq';

/* --- contenedores --- */
export const Root = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

export const Content = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginTop: theme.spacing(10),          // espacio para el Header fijo
  paddingInline: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

/* --- HERO --- */
export const Hero = styled('section')(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  maxWidth: 1200,
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontFamily: '"Allerta Stencil", sans-serif',
  fontWeight: 700,
  color: theme.palette.primary.dark,
}));

export const SubTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  maxWidth: 600,
  marginInline: 'auto',
  color: theme.palette.text.secondary,
}));

export const CTAStack = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  flexDirection: 'row',
  [mq('xs', 'max')]: {
    flexDirection: 'column',
  },
}));

/* --- Buttons reutilizables --- */
export const PrimaryBtn = styled(Button)(({ theme }) => ({
  [mq('xs', 'max')]: { minWidth: 140 },
}));
export const SecondaryBtn = styled(Button)(({ theme }) => ({
  [mq('xs', 'max')]: { minWidth: 140 },
}));

/* --- FEATURES --- */
export const FeatureGrid = styled('section')(({ theme }) => ({
  marginTop: theme.spacing(8),
  width: '100%',
  maxWidth: 1200,
  [mq('xs', 'max')]: { marginTop: theme.spacing(6) },
}));

export const FeatureCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  background: theme.palette.background.paper,
  boxShadow: (theme.shadows as unknown as string[])[3], // o '0 2px 6px rgba(0,0,0,.1)'
  textAlign: 'center',
  '& svg': {
    fontSize: 48,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
}));
