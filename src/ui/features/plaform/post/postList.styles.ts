import { styled } from '@mui/system';
import { Box, Avatar, Button } from '@mui/material';

export const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',      // Centra el contenido verticalmente
    flexDirection: 'column',   // Organiza los elementos en columna
    padding: theme.spacing(2),
    minHeight: '100vh',        // Ocupa toda la altura de la pantalla para centrar verticalmente
    backgroundColor: theme.palette.background.default, // Ajusta el fondo si es necesario
}));

export const PostContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(2),
}));

export const UserAvatar = styled(Avatar)({
    width: '50px',
    height: '50px',
});

export const PostContent = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
});

export const PostImage = styled('img')({
    width: '100%',
    maxWidth: '200px',
    borderRadius: '4px',
});

export const RatingSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
});

export const CommentButton = styled(Button)({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'none',
});

