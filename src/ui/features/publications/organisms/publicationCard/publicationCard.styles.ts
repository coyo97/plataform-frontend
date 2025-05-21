// features/publications/organisms/publicationCard/publicationCard.styles.ts
import { styled } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';

import mq from '../../../../../config/mq';
import { radius } from '../../../../../Theme/tokens/radius';
import { shadows } from '../../../../../Theme/tokens/shadows';

export const CardRoot = styled(Card)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	borderRadius : radius.mdlg,
	boxShadow    : shadows.md,
	transition   : 'box-shadow .25s',

	'&:hover': { boxShadow: shadows.lg },

	[mq('xs', 'max')]: { marginBottom: theme.spacing(2) },
}));

export const Content = styled(CardContent)(({ theme }) => ({
	'& img, & video': {
		width: '100%',
		borderRadius: radius.md,
		marginTop: theme.spacing(2),
	},
	'& a': { textDecoration: 'none', color: theme.palette.primary.main },
}));

