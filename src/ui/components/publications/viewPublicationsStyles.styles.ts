import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const SidebarContainer = styled('div')(({ theme }) => ({
  padding: '20px',
  backgroundColor: theme.palette.primary.light,
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  [mq('md', 'min')]: {
    width: '300px',
  },
}));

export const FilterTitle = styled('h3')(({ theme }) => ({
  fontSize: '16px',
  marginBottom: '10px',
  color: theme.palette.colorHeader.main,
  [mq('sm', 'min')]: {
    fontSize: '18px',
  },
}));

export const FilterButton = styled('button')<{ active: boolean }>(({ active, theme }) => ({
  display: 'block',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: active ? theme.palette.colorButton.main : theme.palette.primary.light,
  color: active ? '#fff' : theme.palette.colorHeader.main,
  border: `1px solid ${theme.palette.colorHeader.main}`,
  borderRadius: '5px',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '14px',
  [mq('sm', 'min')]: {
    fontSize: '16px',
  },
  '&:hover': {
    backgroundColor: active ? theme.palette.colorButton.second : theme.palette.primary.main,
  },
}));

export const PublicationContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: '10px',
  borderBottom: `1px solid ${theme.palette.secondary.main}`,
  [mq('md', 'min')]: {
    padding: '15px 20px',
  },
}));

export const UserProfileImage = styled('img')({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '15px',
  [mq('sm', 'min')]: {
    width: '60px',
    height: '60px',
  },
});

export const PublicationContent = styled('div')({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
});

export const FilePreview = styled('img')({
  width: '100%',
  height: 'auto',
  maxWidth: '300px',
  borderRadius: '5px',
  marginTop: '10px',
  [mq('sm', 'min')]: {
    maxWidth: '400px',
  },
});

export const CommentButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  color: theme.palette.colorHeader.main,
  cursor: 'pointer',
  fontSize: '14px',
  marginTop: '10px',
  [mq('sm', 'min')]: {
    fontSize: '16px',
  },
  '&:hover': {
    textDecoration: 'underline',
  },
}));

