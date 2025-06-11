// conversationItem.styles.ts
import { styled } from '@mui/material/styles';
import { radius } from '../../../../../Theme/tokens/radius';
import { padding } from '../../../../../Theme/tokens/padding';

export const Item = styled('button')< { active?:boolean } >(({ theme, active }) => ({
	width:'100%',
	display:'flex',
	alignItems:'center',
	gap: padding.px8,
	padding: padding.px8,
	textAlign:'left',
	backgroundColor: active ? theme.palette.primary.light : theme.palette.background.paper,
	border:'none',
	borderRadius: radius.sm,
	cursor:'pointer',
	transition:'background-color .2s',
	'&:hover':{ backgroundColor: theme.palette.action.hover },
}));

export const Name = styled('span')(({ theme }) => ({
	fontWeight:500,
	color: theme.palette.text.primary,
	overflow:'hidden',
	textOverflow:'ellipsis',
	whiteSpace:'nowrap',
}));

