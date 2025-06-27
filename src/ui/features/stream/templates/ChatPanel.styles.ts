import { styled } from '@mui/material/styles';
import { Paper, Box, TextField, Typography } from '@mui/material';
import { padding } from '../../../../Theme/tokens/padding';
import { radius } from '../../../../Theme/tokens/radius';
import { colors } from '../../../../Theme/tokens/colors';

export const ChatContainer = styled(Paper)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	height: 'min(65vh, 480px)',        // móvil
	[theme.breakpoints.up('md')]: {
		height: 'min(70vh, 600px)',      // desktop
	},
	borderRadius: radius.sm4x,
}));

export const Header = styled(Box)(({ theme }) => ({
	padding: padding.px8,
	borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const RecipientBox = styled(Box)({
	padding: padding.px8,
});

export const Messages = styled(Box)({
	flex: 1,
	overflowY: 'auto',
	paddingInline: padding.px8,
});

export const MessageRow = styled(Box)<{ isSelf?: boolean }>(({ isSelf }) => ({
	display: 'flex',
	alignItems: 'flex-start',
	marginBottom: 8,
	...(isSelf && {
		flexDirection: 'row-reverse',
		textAlign: 'right',
	}),
}));

export const Footer = styled('form')(({ theme }) => ({
	padding: padding.px8,
	borderTop: `1px solid ${theme.palette.divider}`,
}));

export const MessageText = styled(Typography)({
	overflowWrap: 'anywhere',
});

