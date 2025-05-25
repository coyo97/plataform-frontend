import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';

export const CleanAccordion = styled(MuiAccordion)(({ theme }) => ({
	background: 'transparent',
	boxShadow : 'none',
	border    : '1px solid #FFD700', // ← borde dorado
	borderRadius: theme.shape.borderRadius, // opcional
with: '100%',
	padding: '0px 0px',

	'&:before': { display: 'none' },

'& .MuiAccordionSummary-root': {
	padding: '0px 8px',
	minHeight  : 40,                    // igual al SelectBox aprox
	alignItems : 'center',             // centra verticalmente
},

	'& .MuiAccordionDetails-root': {
		padding: theme.spacing(0.5, 1, 1),
	},
}));

