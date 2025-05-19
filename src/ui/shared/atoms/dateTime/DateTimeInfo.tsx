// src/ui/shared/atoms/dateTime/DateTimeInfo.tsx
import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { Tooltip } from '@mui/material';
import { formatDate } from '../../../../utils/dateTime/formatTime';
import { DateTimeInfoProps } from './dateTimeInfo.types';
import { Wrapper, Text, IconWrapper } from './dateTimeInfo.styles';

const DateTimeInfo: React.FC<DateTimeInfoProps> = ({
	timestamp,
	format = 'relative',
	showIcon = false,
	iconPosition = 'left',
	variant = 'default',
	size = 'medium',
	className,
	tooltipFormat = 'absolute',
	showTooltip = true,
}) => {
	const timeText = formatDate(timestamp, format);
	const tooltipText = showTooltip ? formatDate(timestamp, tooltipFormat) : '';

	const icon =
		format === 'absolute' ? <EventIcon fontSize="inherit" /> : <AccessTimeIcon fontSize="inherit" />;

	const content = (
		<Wrapper className={className} variant={variant} size={size}>
			{showIcon && iconPosition === 'left' && <IconWrapper>{icon}</IconWrapper>}
			<Text>{timeText}</Text>
			{showIcon && iconPosition === 'right' && <IconWrapper>{icon}</IconWrapper>}
		</Wrapper>
	);

	return showTooltip ? <Tooltip title={tooltipText}>{content}</Tooltip> : content;
};

export default DateTimeInfo;

