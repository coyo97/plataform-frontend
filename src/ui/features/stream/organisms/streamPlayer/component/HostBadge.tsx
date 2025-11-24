// component/HostBadge.tsx
import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import Text from '../../../../../shared/atoms/typography/Text';

interface Props {
	teacherName: string;
}

const HostBadge: React.FC<Props> = ({ teacherName }) => (
	<SmartBox
		row
		gap="px2"
		style={{
			marginTop: 8,
			padding: '6px 10px',
			borderRadius: 999,
			background: 'rgba(10,10,12,0.9)',
			border: '1px solid rgba(255,255,255,0.08)',
			alignSelf: 'flex-start',
			display: 'flex',
			alignItems: 'center',
		}}
	>
		<Text
			size="xs"
			weight="bold"
			style={{
				padding: '2px 8px',
				borderRadius: 999,
				background: '#FF5252',
				color: '#fff',
				textTransform: 'uppercase',
				letterSpacing: 0.8,
			}}
		>
			ANFITRIÓN
		</Text>
		<Text size="sm">{teacherName}</Text>
	</SmartBox>
);

export default HostBadge;

