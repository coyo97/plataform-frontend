import { styled } from '@mui/material/styles';
import { CardContent } from '@mui/material';

export const PublicationFormBody = styled('div')(({ theme }) => ({
	display : 'grid',
	gap     : theme.spacing(1),
	padding: theme.spacing(1.5, 0),
	paddingX : 0,
}));
export default PublicationFormBody;

