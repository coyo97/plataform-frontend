import { styled } from '@mui/system';
import mq from '../../../config/mq';

// viewPublicationsStyles.styles.ts
//  sólo muestra las líneas añadidas / modificadas
export const SidebarContainer = styled('div')(({ theme }) => ({
	/* …estilos que ya tenías… */
	padding: 20,
	backgroundColor: theme.palette.primary.light,
	borderRadius: 10,
	boxShadow: '0 4px 8px rgba(0,0,0,0.1)',

	/*  Sticky para escritorios  */
	position: 'sticky',
	top: theme.spacing(2),      // debajo del header
	alignSelf: 'flex-start',        // evita que se estire a toda la altura
	/*   En mobile se comporta “normal” */
	[mq('md', 'max')]: {
		position: 'static',      // deja de ser sticky < md
		width: '100%',           // ocupa todo el ancho
		marginBottom: theme.spacing(2),
	},

	/*   En ≥ md sigue con ancho fijo */
	[mq('md', 'min')]: {
		width: 300,
	},
}));

export const FilterTitle = styled('h3')(({ theme }) => ({
	fontSize: '18px',
	marginBottom: '10px',
	color: theme.palette.colorHeader.main,
	[mq('sm', 'min')]: {
		fontSize: '20px',
	},
}));

export const FilterButton = styled('button')<{ active: boolean }>(({ active, theme }) => ({
	display: 'block',
	width: '100%',
	padding: '10px',
	marginBottom: '10px',
	backgroundColor: active ? theme.palette.colorButton.main : theme.palette.primary.light,
	color: active ? '#fff' : theme.palette.colorHeader.main,
	border: `1px solid ${theme.palette.colorHeader.main}`,
	borderRadius: '5px',
	cursor: 'pointer',
	textAlign: 'left',
	fontSize: '16px',
	[mq('sm', 'min')]: {
		fontSize: '16px',
	},
	'&:hover': {
		backgroundColor: active ? theme.palette.colorButton.second : theme.palette.primary.main,
	},
}));

