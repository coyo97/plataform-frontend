// chatSidebar.styles.ts
import { styled } from '@mui/material/styles';
import { padding } from '../../../../../Theme/tokens/padding';

export const Wrapper = styled('aside')(({ theme }) => ({
	width: 280,
	maxHeight:'100%',
	overflowY:'auto',
	borderRight:`1px solid ${theme.palette.divider}`,
	padding: padding.px8,
}));

export const SectionTitle = styled('h6')(({ theme }) => ({
	margin:`${padding.px8} 0`,
	fontWeight:600,
	color: theme.palette.text.secondary,
}));

