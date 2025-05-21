// filterSidebar.styles.ts
import { styled } from '@mui/material/styles';

export const FilterButton = styled('button')<{ active: boolean }>(({ theme, active }) => ({
	display: 'block',
	width: '100%',
	padding: theme.spacing(1.25),
	marginBottom: theme.spacing(1.25),
	fontSize: 16,
	textAlign: 'left',
	borderRadius: theme.radius.sm4x,
	cursor: 'pointer',
	background: active ? theme.palette.colorButton.main : theme.palette.primary.light,
	color: active ? '#fff' : theme.palette.colorHeader.main,
	border: `1px solid ${theme.palette.colorHeader.main}`,
	'&:hover': {
		background: active ? theme.palette.colorButton.second : theme.palette.primary.main,
	},
}));

