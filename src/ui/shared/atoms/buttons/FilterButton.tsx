import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

interface Props {
	active: boolean;
}

const FilterButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'active',
})<Props>(({ theme, active }) => ({
	justifyContent: 'flex-start',
	width: '100%',
	boxShadow: theme.shadows[1], // xs
	textTransform: 'none',
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(1, 2),
	color: active ? theme.palette.common.white : theme.palette.text.primary,
	background: active ? theme.palette.primary.main : 'transparent',
	'&:hover': {
		background: active
			? theme.palette.primary.dark
			: theme.palette.action.hover,
	},
}));

export default FilterButton;

