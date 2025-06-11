// ui/features/chat/atoms/MessageBubble/OutgoingBubble.tsx
import React from 'react';
import getEnv from '../../../../../config/configEnvs';
import IconButton from '../../../../shared/atoms/buttons/iconButton/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import {
	Wrapper,
	Bubble,
	Time,
	FileImg,
	FileLink
} from './outgoingBubble.styles';

import type { OutgoingBubbleProps } from './outgoingBubble.types';

const OutgoingBubble: React.FC<OutgoingBubbleProps> = ({ msg, onDelete }) => {
	const { HOST } = getEnv();

	/* fecha segura */
	const when = (() => {
		const d = new Date(msg.createdAt);
		return isNaN(d.getTime()) ? 'Fecha inválida' : d.toLocaleString();
	})();

	/* render del contenido */
	const render = () => {
		if (msg.filePath && msg.fileType) {
			const url = `${HOST}/${msg.filePath}`;
			return msg.fileType.startsWith('image/')
				? <FileImg src={url} alt="imagen enviada" />
				: <FileLink href={url} target="_blank">Descargar archivo</FileLink>;
		}
		return <p>{msg.content}</p>;
	};

	return (
		<Wrapper>
			<Bubble>
				{render()}
				<Time>{when}</Time>

				{/* Botón eliminar opcional */}
				{onDelete && (
					<IconButton
						ariaLabel="Eliminar mensaje"
						colorType="error"
						sizeType="xs"
						shape="circle"
						onClick={() => onDelete(msg._id)}
						sx={{ position:'absolute', top:4, right:4 }}
					>
						<DeleteIcon fontSize="inherit" />
					</IconButton>
				)}
			</Bubble>
		</Wrapper>
	);
};

export default OutgoingBubble;

