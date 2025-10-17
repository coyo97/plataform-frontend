import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';

export const TableContainerBase = styled(TableContainer, {
	shouldForwardProp: (prop) => prop !== 'dense',
})<{ dense?: boolean }>(({ theme, dense }) => ({
	boxShadow: theme.shadows[3],
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.background.paper,
	overflowX: 'auto',
	display: 'flex',
	flexDirection: 'column',
	paddingBlock: dense ? theme.spacing(0.5) : theme.spacing(1),
}));

export const ToolbarBox = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
	borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const TableBase = styled(Table)(({ theme }) => ({
	width: '100%',
	borderCollapse: 'separate',
	borderSpacing: 0,
	tableLayout: 'auto',
}));

export const TableHeadBase = styled(TableHead, {
	shouldForwardProp: (prop) => prop !== 'skin' && prop !== 'sticky',
})<{ skin?: 'default' | 'surface'; sticky?: boolean }>(({ theme, skin = 'default', sticky }) => ({
	background:
		skin === 'surface'
			? theme.palette.background.paper
			: theme.palette.action.hover,
			position: sticky ? 'sticky' as any : undefined,
			top: sticky ? 0 : undefined,
			zIndex: sticky ? 1 : undefined,
}));

export const TableCellBase = styled(TableCell, {
	shouldForwardProp: (prop) => !['isHead','truncate','sticky'].includes(prop as string),
})<{ isHead?: boolean; truncate?: boolean; sticky?: 'left'|'right' }>(({ theme, isHead, truncate, sticky }) => ({
	fontWeight: isHead ? 600 : 400,
	whiteSpace: truncate ? 'nowrap' : undefined,
	textOverflow: truncate ? 'ellipsis' : undefined,
	overflow: truncate ? 'hidden' : undefined,
	borderBottom: `1px solid ${theme.palette.divider}`,
	padding: theme.spacing(1),
	position: sticky ? 'sticky' : undefined,
	left: sticky === 'left' ? 0 : undefined,
	right: sticky === 'right' ? 0 : undefined,
	zIndex: sticky ? 2 : undefined,
	background: sticky ? theme.palette.background.paper : undefined,
}));

export const TableRowBase = styled(TableRow, {
	shouldForwardProp: (prop) => prop !== 'zebra' && prop !== 'hoverable',
})<{ zebra?: boolean; hoverable?: boolean }>(({ theme, zebra, hoverable }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: zebra ? theme.palette.action.hover : undefined,
	},
	'&:hover': {
		backgroundColor: hoverable ? theme.palette.action.hover : undefined,
	},
}));

/* ===== Modo Card (móvil) ===== */
export const CardsWrapper = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gap: theme.spacing(1.5),
}));

export const CardRow = styled('div')(({ theme }) => ({
	borderRadius: theme.shape.borderRadius,
	background: theme.palette.background.paper,
	boxShadow: theme.shadows[1],
	border: `1px solid ${theme.palette.divider}`,
	padding: theme.spacing(1),
	display: 'grid',
	gridTemplateColumns: '1fr',
	rowGap: theme.spacing(0.5),
}));

export const CardLine = styled('div')<{ align?: 'left' | 'center' | 'right' }>(
	({ theme, align }) => ({
		display: 'grid',
		gridTemplateColumns: '120px 1fr',
		columnGap: theme.spacing(1),
		alignItems: 'center',
		'& ._label': {
			color: theme.palette.text.secondary,
			fontWeight: 600,
			fontSize: theme.typography.pxToRem(12),
			textTransform: 'uppercase',
			letterSpacing: '.02em',
		},
		'& ._value': {
			textAlign: align ?? 'left',
		},
	})
);

export const CardActions = styled('div')(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(1),
	marginTop: theme.spacing(0.5),
	flexWrap: 'wrap',
}));

