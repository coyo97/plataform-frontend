// src/ui/shared/organisms/formLayout/formLayout.styles.ts
import { styled } from '@mui/material/styles';
import { radius } from '../../../../Theme/tokens/radius';
import { padding } from '../../../../Theme/tokens/padding';

export const FormCard = styled('form')(({ theme }) => ({
	width: '100%',
	maxWidth: 600,
	margin: '16px auto',
	padding: padding.px12,
	borderRadius: radius.sm4x,
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	gap: 16,
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[1],
}));

export const FormHeader = styled('header')({
	display: 'flex',
	flexDirection: 'column',
	gap: 4,
});

export const FormBody = styled('div')({
	width: '100%',
});

export const FormActions = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	gap: 8,
	marginTop: 8,
});

