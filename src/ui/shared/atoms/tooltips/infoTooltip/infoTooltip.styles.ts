import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

export const StyledIconWrapper = styled(IconButton, {
	shouldForwardProp: prop => prop !== 'size',
})<{ size: 'small' | 'medium' | 'large' }>(({ theme, size }) => {
	const dimensions = {
		small: theme.spacing(3),
		medium: theme.spacing(4),
		large: theme.spacing(5),
	};

	return {
		width: dimensions[size],
		height: dimensions[size],
		color: theme.palette.text.secondary,
		padding: 0,
		'&:hover': {
			color: theme.palette.primary.main,
			backgroundColor: 'transparent',
		},
		'&:focus': {
			outline: `2px solid ${theme.palette.primary.main}`,
			outlineOffset: '2px',
		},
	};
});

