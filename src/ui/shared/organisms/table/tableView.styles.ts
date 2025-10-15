import { styled } from '@mui/material/styles';
import {
	TableContainer as MuiTableContainer,
	Table as MuiTable,
	TableHead as MuiTableHead,
	TableRow as MuiTableRow,
	TableCell as MuiTableCell,
	Box,
} from '@mui/material';

export const TableContainerBase = styled(MuiTableContainer, {
	shouldForwardProp: (prop) => prop !== 'dense'
})<{ dense?: boolean }>(({ theme, dense }) => ({
	boxShadow: theme.shadows[3],
	borderRadius: theme.radius?.md ?? 12,
	backgroundColor: theme.palette.background.paper,
	overflowX: 'auto',
	padding: dense ? theme.spacing(1) : theme.spacing(2),
}));

export const TableBase = styled(MuiTable)({
	width: '100%',
	borderCollapse: 'separate', // mejor para sticky header con border-radius
	borderSpacing: 0,
	minWidth: 640,
});

export const TableHeadBase = styled(MuiTableHead, {
	shouldForwardProp: (prop) => prop !== 'skin' && prop !== 'sticky'
})<{
	skin: 'default' | 'uatf' | 'accented';
	sticky?: boolean;
}>(({ theme, skin, sticky }) => {
	const palette = {
		default: {
			bg: theme.palette.primary.light,
			text: theme.palette.primary.contrastText,
		},
		uatf: {
			bg: theme.customColors.uatf.blue,
			text: theme.customColors.uatf.white,
		},
		accented: {
			bg: theme.palette.accent.light,
			text: theme.palette.accent.contrastText,
		},
	}[skin];

	return {
		backgroundColor: palette.bg,
		color: palette.text,
		position: sticky ? 'sticky' as const : undefined,
		top: sticky ? 0 : undefined,
		zIndex: sticky ? 1 : undefined,
		'& th': {
			backgroundColor: palette.bg,
			color: palette.text,
		},
	};
});

export const TableRowBase = styled(MuiTableRow, {
	shouldForwardProp: (prop) => !['zebra', 'hoverable', 'hoverTone'].includes(prop as string),
})<{
	zebra?: boolean;
	hoverable?: boolean;
	hoverTone?: 'default' | 'warning' | 'success' | 'error' | 'accent';
}>(({ theme, zebra, hoverable, hoverTone = 'default' }) => {
	const hoverColors: Record<string, string> = {
		default: theme.palette.action.hover,
		warning: theme.palette.warning.light,
		success: theme.palette.success.light,
		error: theme.palette.error.light,
		accent: theme.palette.accent.light,
	};

	return {
		'&:nth-of-type(even)': zebra ? { backgroundColor: theme.palette.action.hover } : {},
		'&:hover': hoverable ? { backgroundColor: hoverColors[hoverTone] } : {},
		transition: 'background-color 120ms ease',
		cursor: hoverable ? 'pointer' : 'default',
	};
});

export const TableCellBase = styled(MuiTableCell, {
	shouldForwardProp: (prop) => !['isHead', 'truncate'].includes(prop as string),
})<{
	isHead?: boolean;
	truncate?: boolean;
}>(({ theme, isHead, truncate }) => ({
	borderBottom: `1px solid ${theme.palette.divider}`,
	padding: theme.spacing(1),
	fontWeight: isHead ? 600 : 400,
	fontSize: isHead ? theme.typography.pxToRem(14) : theme.typography.pxToRem(13),
	whiteSpace: truncate ? 'nowrap' : undefined,
	overflow: truncate ? 'hidden' : undefined,
	textOverflow: truncate ? 'ellipsis' : undefined,
}));

export const ToolbarBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
	marginBottom: theme.spacing(1),
}));

export const FooterBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: theme.spacing(1),
	marginTop: theme.spacing(1.5),
}));

/** Variante “card” para móvil: ocultar thead y usar data-label en celdas */
export const CardOnlyHead = styled('div')(({ theme }) => ({
	display: 'none',
}));

export const CardCell = styled('div', {
	shouldForwardProp: (prop) => !['dataLabel'].includes(prop as string),
})<{ dataLabel?: string }>(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '160px 1fr',
	gap: theme.spacing(1),
	padding: theme.spacing(1),
	borderBottom: `1px solid ${theme.palette.divider}`,
	'&::before': {
		content: 'attr(data-label)',
		color: theme.palette.text.secondary,
		fontWeight: 600,
	},
}));

