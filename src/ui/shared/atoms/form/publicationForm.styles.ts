/* ui/features/publications/molecules/publicationForm/publicationForm.styles.ts */
import { styled } from '@mui/material/styles';
import { CardContent, CardActions } from '@mui/material';

const SPACING = 2;                      // theme.spacing(2) = 16 px

export const Body = styled(CardContent)(({ theme }) => ({
	display : 'grid',
	gap     : theme.spacing(1),
	padding : theme.spacing(SPACING),
	paddingTop   : 0,                     /* ya lo aporta CardHeader */
}));

export const Actions = styled(CardActions)(({ theme }) => ({
	justifyContent : 'flex-end',
	gap            : theme.spacing(1.5),
	padding        : theme.spacing(SPACING, SPACING, SPACING / 1.5),
}));

