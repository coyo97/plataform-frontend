import { styled } from '@mui/material/styles';
import { CardActions } from '@mui/material';

const PublicationFormActions = styled(CardActions)(({ theme }) => ({
	justifyContent: 'flex-end',
	padding: theme.spacing(2, 3),
}));

export default PublicationFormActions;

