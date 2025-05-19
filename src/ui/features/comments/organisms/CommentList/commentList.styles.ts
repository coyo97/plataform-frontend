// ui/features/comments/organisms/CommentList/commentList.styles.ts
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const Wrapper = styled(Box)(({ theme }) => ({
	maxHeight : 300,
	overflowY : 'auto',
	marginTop : theme.spacing(2),
	paddingRight: theme.spacing(1),
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
	display : 'flex',
	flexDirection: 'column',
	gap: theme.spacing(1),
}));

