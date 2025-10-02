// textItemRow.styles.ts
import { styled } from '@mui/material/styles';
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase';

export type RootProps = ButtonBaseProps & {
	selected?: boolean;
	sizeKey: 'sm' | 'md' | 'lg';
};

export const paddings = { sm: 0.75, md: 1, lg: 1.25 } as const;

export const Root = styled(ButtonBase, {
	shouldForwardProp: (p) => !['selected', 'sizeKey'].includes(String(p)), // <-- no bloquees 'component'
})<RootProps>(({ theme, selected, sizeKey }) => ({
	width: '100%',
	justifyContent: 'flex-start',
	borderRadius: theme.shape.borderRadius * 1.5,
	padding: theme.spacing(paddings[sizeKey]),
	paddingLeft: theme.spacing(paddings[sizeKey] + 0.5),
	paddingRight: theme.spacing(paddings[sizeKey] + 0.5),
	backgroundColor: selected ? theme.palette.action.selected : 'transparent',
	transition: 'background-color .15s ease, color .15s ease',
	'&:hover': { backgroundColor: theme.palette.action.hover },
	'&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
	gap: theme.spacing(1),
}));

export const IconWrap = styled('span')(({ theme }) => ({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: 32,
	height: 32,
	flexShrink: 0,
}));

export const Content = styled('span')(() => ({
	display: 'inline-flex',
	flexDirection: 'column',
	minWidth: 0,
	flex: 1,
}));

export const Right = styled('span')(({ theme }) => ({
	display: 'inline-flex',
	alignItems: 'center',
	gap: theme.spacing(0.5),
	marginLeft: 'auto',
}));

