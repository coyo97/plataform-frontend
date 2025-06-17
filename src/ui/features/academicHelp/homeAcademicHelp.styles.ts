import { Theme } from '@mui/material';

export const styles = {
	mobileActions: (theme: Theme) => ({
		display: 'flex',
		justifyContent: 'flex-end',
		gap: theme.spacing(1),
		px: theme.spacing(2),
		py: theme.spacing(1),
		backgroundColor: theme.palette.background.paper,
		position: 'sticky',
		top: 0,
		zIndex: 1000,
		borderBottom: `1px solid ${theme.palette.divider}`,
	}),
};

