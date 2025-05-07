// ui/molecules/PublicationActions/publicationActions.styles.ts
import { styled } from '@mui/material/styles';
import { CardActions } from '@mui/material';

export const ActionsBar = styled(CardActions)(({ theme }) => ({
	paddingInline: theme.spacing(2),
	'& .MuiIconButton-root': { marginRight: theme.spacing(1) },
}));

