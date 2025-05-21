// features/publications/moleculas/publicationActions/publicationActions.styles.ts
import { styled } from '@mui/material/styles';
import { CardActions } from '@mui/material';
import mq from '../../../../../config/mq';

export const ActionsBar = styled(CardActions)(({ theme }) => ({
	paddingInline: theme.spacing(6),
	'& .MuiIconButton-root': { marginRight: theme.spacing(3) },

	/* Ejemplo: centrar en pantallas muy estrechas */
	[mq('xs', 'max')]: {
		justifyContent: 'space-between',
		'& .MuiIconButton-root': { marginRight: 0 },
	},
}));

