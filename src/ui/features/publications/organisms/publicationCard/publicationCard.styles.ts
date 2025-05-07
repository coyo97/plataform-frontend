// ui/organisms/PublicationCard/publicationCard.styles.ts
import { styled } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';

export const CardRoot = styled(Card)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	borderRadius: theme.shape.borderRadius * 2,
	boxShadow   : theme.shadows[3],
	transition  : 'box-shadow .25s',
	'&:hover'   : { boxShadow: theme.shadows[6] },
}));

export const Content = styled(CardContent)(({ theme }) => ({
	'& img, & video': {
		width:'100%', borderRadius:theme.shape.borderRadius,
		marginTop:theme.spacing(2),
	},
	'& a': { textDecoration:'none', color:theme.palette.primary.main },
}));

