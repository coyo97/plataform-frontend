import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const SidebarContainer = styled('div')(({ theme }) => ({
	padding: '20px',
	backgroundColor: theme.palette.primary.light,
	borderRadius: '10px',
	boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
	[mq('md', 'min')]: {
		width: '300px',
	},
}));

export const FilterTitle = styled('h3')(({ theme }) => ({
	fontSize: '18px',
	marginBottom: '10px',
	color: theme.palette.colorHeader.main,
	[mq('sm', 'min')]: {
		fontSize: '20px',
	},
}));

export const FilterButton = styled('button')<{ active: boolean }>(({ active, theme }) => ({
	display: 'block',
	width: '100%',
	padding: '10px',
	marginBottom: '10px',
	backgroundColor: active ? theme.palette.colorButton.main : theme.palette.primary.light,
	color: active ? '#fff' : theme.palette.colorHeader.main,
	border: `1px solid ${theme.palette.colorHeader.main}`,
	borderRadius: '5px',
	cursor: 'pointer',
	textAlign: 'left',
	fontSize: '16px',
	[mq('sm', 'min')]: {
		fontSize: '16px',
	},
	'&:hover': {
		backgroundColor: active ? theme.palette.colorButton.second : theme.palette.primary.main,
	},
}));

