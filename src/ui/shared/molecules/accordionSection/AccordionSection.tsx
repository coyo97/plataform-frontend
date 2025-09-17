import React, { ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CleanAccordion } from './accordionSection.styles';
import Text from '../../atoms/typography/Text';

interface Props {
	title: string;
	children: ReactNode;
	variant?: 'default' | 'transparent';
}

const AccordionSection: React.FC<Props> = ({ title, children, variant = 'default' }) => (
	<CleanAccordion disableGutters $variant={variant}>
		<AccordionSummary expandIcon={<ExpandMoreIcon />}>
			<Text>{title}</Text>
		</AccordionSummary>

		<AccordionDetails>{children}</AccordionDetails>
	</CleanAccordion>
);

export default AccordionSection;

