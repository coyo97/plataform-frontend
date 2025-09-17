import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';

export const CleanAccordion = styled(MuiAccordion)<{ $variant?: 'default' | 'transparent' }>(
	({ theme, $variant = 'default' }) => {
		const palette = theme.palette.accordion[$variant];

		return {
			background: palette.background,
			boxShadow: 'none',
			border: `1px solid ${palette.border}`,
			borderRadius: theme.shape.borderRadius,
			width: '100%',
			padding: 0,

			'&:before': { display: 'none' },

			'& .MuiAccordionSummary-root': {
				padding: '0px 8px',
				minHeight: 40,
				alignItems: 'center',
				color: palette.summaryText,
				'&:hover': { backgroundColor: palette.hover },
			},

			'& .MuiAccordionDetails-root': {
				padding: theme.spacing(0.5, 1, 1),
				background: palette.detailsBackground,
			},
		};
	}
);

