import { styled } from '@mui/system';
import { IconButton } from '@mui/material';
import mq from '../../../config/mq';
import { radius } from '../../../Theme/tokens/radius';

export const SearchboxContainer = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	padding: '10px',
	backgroundColor: '#fff',
	borderBottom: '1px solid #ddd',
	[mq('xs', 'min')]: {
		padding: '15px',
	},
});

export const Heading = styled('h4')({
	margin: '0',
	fontSize: '18px',
	fontWeight: 'bold',
	color: '#333',
});

export const SearchBar = styled('div')({
	marginTop: '10px',
	display: 'flex',
	justifyContent: 'space-between',
});

export const SearchButton = styled('button')({
	backgroundColor: 'transparent',
	color: '#dc3545',
	border: 'none',
	cursor: 'pointer',
	fontSize: '16px',
	padding: '5px 10px',
});
export const IconToggle = styled(IconButton)<{ active?: boolean }>(
	({ theme, active }) => ({
		borderRadius : radius.sm3x,
		background   : active ? theme.palette.primary.main : 'transparent',
		color        : active ? theme.palette.common.white : theme.palette.text.secondary,
		transition   : 'background .2s',
		'&:hover'    : { background: theme.palette.action.hover },
	})
);

