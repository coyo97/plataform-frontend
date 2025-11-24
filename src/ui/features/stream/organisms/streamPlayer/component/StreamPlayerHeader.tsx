// component/StreamPlayerHeader.tsx
import React from 'react';
import SmartBox from '../../../../../shared/atoms/box/SmartBox';
import Text from '../../../../../shared/atoms/typography/Text';
import { liveChipStyle, substateStyle } from '../StreamPlayer.styles';

interface Props {
	title?: string;
	description?: string;
	teacherName: string;
	viewersCount: number;
}

const StreamPlayerHeader: React.FC<Props> = ({
	title,
	description,
	teacherName,
	viewersCount,
}) => {
	const espectadoresLabel =
		viewersCount === 1 ? 'espectador' : 'espectadores';

	return (
		<>
			{/* Header jerárquico del player */}
			<SmartBox row between gap="px8">
				<SmartBox
					row
					gap="px2"
					style={{ alignItems: 'center' }}
				>
					<span style={liveChipStyle} aria-label="Transmisión en vivo">
						EN VIVO
					</span>
					<Text size="lg" weight="bold" as="h1">
						🎥 {title ?? 'Transmisión en vivo'}
					</Text>
				</SmartBox>

				{/* Línea secundaria: Profesor | espectadores */}
				<SmartBox row gap="px6">
					<Text size="sm">
						<strong>Profesor:</strong> {teacherName}
					</Text>
					<Text size="sm" aria-label="Conteo de espectadores">
						| {viewersCount} {espectadoresLabel}
					</Text>
				</SmartBox>
			</SmartBox>

			{/* Subestado animado */}
			<Text as="p" style={substateStyle}>
				<span role="img" aria-hidden="true">📡</span> Transmitiendo…
			</Text>

			{description && (
				<Text size="sm" style={{ marginTop: 4 }}>
					{description}
				</Text>
			)}
		</>
	);
};

export default StreamPlayerHeader;

