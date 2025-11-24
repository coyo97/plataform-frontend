import { styled } from '@mui/material/styles';
import { Paper, Box, Typography } from '@mui/material';
import { padding } from '../../../../Theme/tokens/padding';
import { radius } from '../../../../Theme/tokens/radius';

export const ChatContainer = styled(Paper)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	borderRadius: radius.sm4x,
	borderLeft: `1px solid ${theme.palette.divider}`,
	boxShadow: '-12px 0 32px rgba(0,0,0,0.35)',
	backgroundColor: theme.palette.background.paper,
}));

export const Header = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
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
	paddingTop: padding.px4 ?? 4,
	paddingBottom: padding.px4 ?? 4,
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

