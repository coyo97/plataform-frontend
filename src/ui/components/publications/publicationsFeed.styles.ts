// src/ui/components/publications/publicationsFeed.styles.ts
import { styled } from '@mui/material/styles';
import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Typography,
	IconButton,
	Avatar,
	Chip,
} from '@mui/material';

export const FeedWrapper = styled('div')(({ theme }) => ({
	flex: 1,
	marginLeft: theme.spacing(3),
	[theme.breakpoints.down('sm')]: { marginLeft: 0 },
}));

export const PostCard = styled(Card)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	borderRadius: theme.shape.borderRadius * 2,
	boxShadow: theme.shadows[3],
	transition: 'box-shadow .25s',
	'&:hover': { boxShadow: theme.shadows[6] },
}));

export const PostActions = styled(CardActions)(({ theme }) => ({
  paddingInline: theme.spacing(2),
  '& .MuiIconButton-root': { marginRight: theme.spacing(1) },
}));

export const PostHeader = styled(CardHeader)(({ theme }) => ({
	'& .MuiCardHeader-title': {
		fontWeight: 600,
		fontSize: '1.1rem',
	},
	'& .MuiCardHeader-subheader': {
		fontSize: '0.8rem',
		color: theme.palette.text.secondary,
	},
}));

export const PostContent = styled(CardContent)(({ theme }) => ({
	'& img, & video': {
		width: '100%',
		borderRadius: theme.shape.borderRadius,
		marginTop: theme.spacing(2),
	},
	'& a': { textDecoration: 'none', color: theme.palette.primary.main },
}));

export const TagChip = styled(Chip)(({ theme }) => ({
	marginRight: theme.spacing(0.5),
	marginTop: theme.spacing(1),
}));

