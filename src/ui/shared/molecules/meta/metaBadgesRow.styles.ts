import { styled } from '@mui/material/styles';

export const Row = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'wrap',
	gap: theme.spacing(1),
}));

