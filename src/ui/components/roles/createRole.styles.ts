// src/ui/components/roles/createRole.styles.ts
import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import mq from '../../../config/mq';

export const Container = styled('div')(({ theme }: { theme?: Theme }) => ({
  backgroundColor: theme?.palette.colorForm.main,
  borderRadius: theme?.shape.borderRadius,
  padding: '20px',
  margin: '20px auto',
  [mq('xxs', 'max')]: {
    width: '90%',
  },
  [mq('md', 'min')]: {
    width: '50%',
  },
}));

export const Title = styled('h2')(({ theme }: { theme?: Theme }) => ({
  color: theme?.palette.primary.contrastText,
  textAlign: 'center',
  marginBottom: '20px',
}));

export const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
});

export const InputGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const Label = styled('label')({
  fontWeight: 'bold',
});

export const Input = styled('input')({
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
});

export const TextArea = styled('textarea')({
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
});

export const Select = styled('select')({
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
});

export const Button = styled('button')(({ theme }: { theme?: Theme }) => ({
  padding: '10px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: theme?.palette.colorButton.main,
  color: theme?.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme?.palette.colorButton.second,
  },
}));

