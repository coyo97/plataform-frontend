import { Box, Button, Typography, styled } from '@mui/material';
import mq from '../../../config/mq';
import { padding } from '../../../Theme/tokens/padding';
import { radius } from '../../../Theme/tokens/radius';
import { shadows } from '../../../Theme/tokens/shadows';
import typography from '../../../Theme/tokens/typography';
import { colors } from '../../../Theme/tokens/colors';

export const ModuleManagementContainer = styled(Box)(({ theme }) => ({
	padding: padding.px12,
	backgroundColor: colors.neutral.graySoft[50],
	borderRadius: radius.md,
	boxShadow: shadows.md,
	width: '100%',
	maxWidth: '800px',
	margin: '0 auto',

	[mq('sm', 'max')]: {
		padding: padding.px8,
		maxWidth: '100%',
	},
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
	...typography.heading.h2.sans.semiBold,
	marginBottom: padding.px12,
	textAlign: 'center',
	width: '100%',
	wordWrap: 'break-word',
	wordBreak: 'break-word',

	[mq('sm', 'max')]: {
		...typography.heading.h3.sans.regular,
		textAlign: 'left',
	},

	[mq('md', 'min')]: {
		...typography.heading.h2.sans.regular,
	},
}));

export const ModuleList = styled('ul')({
	listStyle: 'none',
	padding: 0,
	margin: 0,
	width: '100%',
});

export const ModuleItem = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'space-between',
	padding: padding.px8,
	borderBottom: `1px solid ${colors.neutral.graySoft[200]}`,
	gap: padding.px8,

	'&:nth-of-type(even)': {
		backgroundColor: colors.neutral.graySoft[50],
	},

	[mq('sm', 'min')]: {
		flexDirection: 'row',
		alignItems: 'center',
	},
}));

export const ActionButton = styled(Button)(({ theme }) => ({
	...typography.heading.h3.sans.regular,
	padding: padding.px8,
	width: '100%',
	textTransform: 'none',

	[mq('sm', 'min')]: {
		width: 'auto',
	},
}));

export const InputContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: padding.px12,
	marginBottom: padding.px12,
	alignItems: 'stretch',

	[mq('sm', 'min')]: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
}));

