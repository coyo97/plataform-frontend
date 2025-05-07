import { styled, SxProps, Theme } from '@mui/material/styles';
import mq from '../../../../../config/mq';

/* contenedor lateral (Create / Filter) */
export const SidebarContainer = styled('aside')(({ theme }) => ({
	padding      : theme.spacing(2.5),
	background   : theme.palette.primary.light,
	borderRadius : theme.shape.borderRadius * 2,
	boxShadow    : theme.shadows[2],
	alignSelf    : 'flex-start',
	position     : 'sticky',
	top          : `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(2)})`,
	maxHeight    : `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(	4)})`, // 100 vh menos header y padding
	overflowY: 'auto',
	overflowX: 'hidden',
		[mq('md','max')]: {
			position : 'static',
			width    : '100%',
			marginBottom: theme.spacing(2),
		},
		[mq('md','min')]: {
			width: 300,
		},
}));

export const FilterTitle = styled('h3')(({ theme }) => ({
	fontSize     : 18,
	marginBottom : theme.spacing(1.5),
	color        : theme.palette.colorHeader.main,
}));

export const FilterButton = styled('button')<{active:boolean}>(({ theme, active }) => ({
	display      : 'block',
	width        : '100%',
	padding      : theme.spacing(1.25),
	marginBottom : theme.spacing(1.25),
	fontSize     : 16,
	textAlign    : 'left',
	borderRadius : 5,
	cursor       : 'pointer',
	background   : active ? theme.palette.colorButton.main
		: theme.palette.primary.light,
		color        : active ? '#fff' : theme.palette.colorHeader.main,
		border       : `1px solid ${theme.palette.colorHeader.main}`,
		'&:hover'    : {
			background : active ? theme.palette.colorButton.second
				: theme.palette.primary.main,
		},
}));

export const sidebarSX: SxProps<Theme> = {
	display   : { xs:'none', md:'none', lg:'block' },
	position  : 'sticky',
	top       : t => `calc(${t.mixins.toolbar.minHeight}px + ${t.spacing(2)})`,
	maxHeight : t => `calc(100vh - ${t.mixins.toolbar.minHeight}px - ${t.spacing(4)})`,
	overflowY : 'auto',
	p         : 2.5,
	borderRadius: 2,
	bgcolor   : 'primary.light',
	boxShadow : 2,
};

