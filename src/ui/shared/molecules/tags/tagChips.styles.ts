import { styled } from '@mui/material/styles';

export const ChipsRow = styled('div')(({ theme }) => ({
	display: 'flex',
	flexWrap: 'wrap',
	gap: theme.spacing(1),
}));

export const Anchor = styled('a')({
	textDecoration: 'none',
});

