import { styled } from '@mui/material/styles';
import { Card, Box } from '@mui/material';
import mq from '../../../../config/mq';
import { radius } from '../../../../Theme/tokens/radius';
import { shadows } from '../../../../Theme/tokens/shadows';
import { colors } from '../../../../Theme/tokens/colors';

/* → contenedor responsivo de 1 o 2 columnas */
export const ListGrid = styled('div')(({ theme }) => ({
	display: 'grid',
	gap    : theme.spacing(2),
	gridTemplateColumns: '1fr',
	[mq('sm','min')]: { gridTemplateColumns: '1fr 1fr' },
}));

/* → tarjeta */
export const CardWrapper = styled(Card)<{ $selected: boolean }>(({ theme, $selected }) => ({
	display      : 'flex',
	alignItems   : 'flex-start',
	gap          : theme.spacing(1.5),
	padding      : theme.spacing(2),
	borderRadius : radius.md,
	cursor       : 'pointer',
	boxShadow    : shadows.sm,
	border       : `2px solid ${$selected ? colors.brand.primary[500] : 'transparent'}`,
	transition   : 'border-color .2s, box-shadow .2s',
	'&:hover'    : { boxShadow: shadows.md },
}));

/* → área de textos */
export const TextBox = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	gap: 2,
});

