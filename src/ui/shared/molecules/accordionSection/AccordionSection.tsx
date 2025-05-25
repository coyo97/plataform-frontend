import React, { ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CleanAccordion } from './accordionSection.styles';
import Text from '../../atoms/typography/Text';

interface Props {
	title   : string;
	children: ReactNode;
}

const AccordionSection: React.FC<Props> = ({ title, children }) => (
	<CleanAccordion disableGutters>
		<AccordionSummary expandIcon={<ExpandMoreIcon />}>
			<Text sx={{ color: '#FFD700' }}>{title}</Text>	
		</AccordionSummary>

		<AccordionDetails>
			{children}
		</AccordionDetails>
	</CleanAccordion>
);

export default AccordionSection;

