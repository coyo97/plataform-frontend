// shared/molecules/accordionSection/AccordionSection.tsx
import React, { ReactNode } from 'react';
import {
	Accordion, AccordionSummary, AccordionDetails, Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
	title   : string;           // ✔  ahora existe
	children: ReactNode;
}

const AccordionSection:React.FC<Props>=({ title, children })=>(
	<Accordion disableGutters>
		<AccordionSummary expandIcon={<ExpandMoreIcon/>}>
			<Typography fontWeight={600}>{title}</Typography>
		</AccordionSummary>
		<AccordionDetails>{children}</AccordionDetails>
	</Accordion>
);

export default AccordionSection;

