// component/ScreenShareCarousel.tsx
import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import Text from '../../../../../shared/atoms/typography/Text';

interface Props {
	label: string;
	ariaLabel: string;
}

const ScreenShareCarousel: React.FC<Props> = ({ label, ariaLabel }) => (
	<SmartBox column gap="px2" style={{ marginTop: 8 }}>
		<Text size="xs" style={{ opacity: 0.8 }}>
			{label}
		</Text>

		<div
			id="screenGrid"
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'stretch',
				gap: 12,
				width: '100%',
				overflowX: 'auto',
				overflowY: 'hidden',
				padding: '4px 2px 6px',
			}}
			aria-label={ariaLabel}
		/>
	</SmartBox>
);

export default ScreenShareCarousel;

