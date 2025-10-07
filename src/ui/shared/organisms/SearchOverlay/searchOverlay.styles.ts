// src/ui/shared/organisms/SearchOverlay/searchOverlay.styles.ts
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const OverlayContainer = styled(Box)(({ theme }) => ({
	position: 'fixed',
	  top: 'calc(var(--header-h) + 4px)',
	left: 0,
	width: '100%',
	height: 'calc(100vh - var(--header-h) - 4px)',
	backgroundColor: '#fff',
	display: 'flex',
	flexDirection: 'column',
	padding: theme.spacing(2),
	zIndex: theme.zIndex.modal,
}));

export const TabsContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(2),
	marginTop: theme.spacing(2),
	borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const TabItem = styled('button')<{ active?: boolean }>(({ theme, active }) => ({
	background: 'none',
	border: 'none',
	cursor: 'pointer',
	fontWeight: active ? 600 : 400,
	color: active ? theme.palette.primary.main : theme.palette.text.secondary,
	padding: theme.spacing(1, 2),
	borderBottom: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
	transition: 'all 0.2s ease-in-out',

	'&:hover': {
		color: theme.palette.primary.main,
	},
}));

export const ResultsSection = styled(Box)(({ theme }) => ({
	marginTop: theme.spacing(2),
	overflowY: 'auto',
	flex: 1,
}));

