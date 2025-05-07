import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  padding: '20px',
  maxWidth: '600px',
  margin: '0 auto',
  [mq('sm', 'min')]: {
    padding: '30px',
  },
});

export const TextareaField = styled('textarea')(({ theme }) => ({
  padding: '10px',
  fontSize: '14px',
  borderRadius: '5px',
  border: `1px solid ${theme.palette.secondary.main}`,
  //fontFamily: theme.typography.fontFamily,
  minHeight: '120px',
  [mq('sm', 'min')]: {
    fontSize: '16px',
    padding: '12px',
  },
}));

export const InputField = styled('input')(({ theme }) => ({
  padding: '8px',
  fontSize: '14px',
  borderRadius: '5px',
  border: `1px solid ${theme.palette.secondary.main}`,
  //fontFamily: theme.typography.fontFamily,
  [mq('sm', 'min')]: {
    fontSize: '16px',
    padding: '10px',
  },
}));

export const SubmitButton = styled('button')(({ theme }) => ({
  padding: '10px 15px',
  fontSize: '14px',
  backgroundColor: theme.palette.colorButton.main,
  color: theme.palette.common.white,
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  //fontFamily: theme.typography.fontFamily,
  [mq('sm', 'min')]: {
    fontSize: '16px',
    padding: '12px 18px',
  },
  '&:hover': {
    backgroundColor: theme.palette.colorButton.second,
  },
}));

