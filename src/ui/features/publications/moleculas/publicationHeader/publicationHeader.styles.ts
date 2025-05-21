//features/publications/moleculas/publicationHeader/publicationHeader.styles.ts
import { styled } from '@mui/material/styles';
import { CardHeader } from '@mui/material';

import mq from '../../../../../config/mq';
import { radius } from '../../../../../Theme/tokens/radius';
import { shadows } from '../../../../../Theme/tokens/shadows';

export const StyledHeader = styled(CardHeader)(({ theme }) => ({
	paddingInline: theme.spacing(2),
	 alignItems: 'flex-start',         // ① avatar arriba a la izquierda
  gap      : theme.spacing(1.5),    // ② separa avatar / texto

	borderRadius : radius.md,
	boxShadow    : shadows.xs,

	'& .MuiCardHeader-avatar': {
		marginRight: theme.spacing(1),
		marginTop: 2,
	},

	/* avatar size tweaks */
	[mq('sm', 'max')]: {
		'& .MuiCardHeader-avatar': { width: 36, height: 36 },
	},
}));

