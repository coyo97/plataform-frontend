// ui/features/comments/molecules/CommentCard/commentCard.styles.ts
import { styled } from '@mui/material/styles';
import { Paper }  from '@mui/material';

export const Card = styled(Paper)(({ theme }) => ({
	padding      : theme.spacing(1.5),
	borderRadius : theme.shape.borderRadius * 1.5,
	boxShadow    : theme.shadows[2],
	background   : theme.palette.background.paper,
	display      : 'grid',
	gridTemplateColumns: '1fr auto',
	gap          : theme.spacing(0.75),
}));

