import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { InfoTooltipProps } from './InfoTooltip.types';
import { StyledIconWrapper } from './infoTooltip.styles';

const InfoTooltip: React.FC<InfoTooltipProps> = ({
	content,
	position = 'top',
	size = 'medium',
	className,
	icon = <InfoOutlinedIcon />,
	delay = 0,
}) => (
	<Tooltip
		title={content}
		placement={position}
		enterDelay={delay}
		arrow
	>
		<StyledIconWrapper
			size={size}
			className={className}
			tabIndex={0}
			aria-label={typeof content === 'string' ? content : undefined}
		>
			{icon}
		</StyledIconWrapper>
	</Tooltip>
);

export default InfoTooltip;

