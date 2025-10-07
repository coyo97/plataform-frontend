import { styled } from '@mui/material/styles';

export const Dt = styled('dt')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(0.75),
	marginTop: theme.spacing(1),
	[theme.breakpoints.up('md')]: {
		marginTop: 0,
	},
}));

export const Dd = styled('dd')(() => ({
	margin: 0,
}));

