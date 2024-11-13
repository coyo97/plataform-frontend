// src/ui/components/report/reportManagementStyles.tsx

import { styled } from '@mui/material/styles';
import mq from '../../../config/mq';

export const Container = styled('div')(({ theme }) => ({
  padding: '20px',
  backgroundColor: theme.palette.background.default,
}));

export const Title = styled('h2')(({ theme }) => ({
  color: theme.palette.primary.main, // Azul oscuro
  textAlign: 'center',
  marginBottom: '20px',
}));

export const Table = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '16px',
  [mq('md', 'max')]: {
    fontSize: '14px',
  },
}));

export const TableHeader = styled('th')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Azul oscuro
  color: theme.palette.primary.contrastText, // Blanco
  padding: '10px',
  border: `1px solid ${theme.palette.divider}`,
}));

export const TableRow = styled('tr')(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover, // Azul muy claro
  },
  '&:hover': {
    backgroundColor: '#FFFAE6', // Amarillo muy claro al pasar el cursor
  },
}));

export const TableCell = styled('td')(({ theme }) => ({
  padding: '10px',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary, // Negro
}));

export const Button = styled('button')<{
  variant?: 'primary' | 'secondary';
}>(({ theme, variant }) => ({
  backgroundColor:
    variant === 'primary'
      ? theme.palette.colorButton.main // Azul oscuro
      : theme.palette.colorButton.second, // Rojo
  color: theme.palette.primary.contrastText, // Blanco
  border: 'none',
  padding: '8px 12px',
  marginRight: '5px',
  cursor: 'pointer',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor:
      variant === 'primary'
        ? theme.palette.primary.dark // Azul más oscuro
        : theme.palette.secondary.dark, // Rojo oscuro
  },
}));

