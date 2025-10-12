import { styled } from '@mui/material/styles';
import { Menu } from '@mui/material';

export const StyledMenu = styled(Menu)(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: theme.shape.borderRadius * 2,
		minWidth: 180,
		boxShadow: theme.shadows[3],
		padding: theme.spacing(1),
	},
	'& .MuiMenuItem-root': {
		borderRadius: theme.shape.borderRadius,
		paddingBlock: theme.spacing(0.5),
		'&:hover': {
			backgroundColor: theme.palette.action.hover,
		},
	},
}));

