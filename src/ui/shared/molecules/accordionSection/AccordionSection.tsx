import React, { ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CleanAccordion } from './accordionSection.styles';
import Text from '../../atoms/typography/Text';

interface Props {
  title: React.ReactNode;            // <- antes string
  children: ReactNode;
  variant?: 'default' | 'transparent';
  defaultExpanded?: boolean;         // útil en “Agregar usuario”
  disabled?: boolean;                // por permisos
  summaryProps?: React.ComponentProps<typeof AccordionSummary>; // extensible
}

const AccordionSection: React.FC<Props> = ({
  title,
  children,
  variant = 'default',
  defaultExpanded,
  disabled,
  summaryProps,
}) => (
  <CleanAccordion disableGutters $variant={variant} defaultExpanded={defaultExpanded} disabled={disabled}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} {...summaryProps}>
      {typeof title === 'string' ? <Text headingLevel="h4">{title}</Text> : title}
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </CleanAccordion>
);

export default AccordionSection;

