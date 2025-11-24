import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import AvatarX from '../../../shared/atoms/avatar/AvatarX';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import { ThumbUp, CheckCircle, Edit, Delete } from '@mui/icons-material';
import Text from '../../../shared/atoms/typography/Text';
import Paper from '@mui/material/Paper';
import DateTimeInfo from '../../../shared/atoms/dateTime/DateTimeInfo';
import IconButton from '../../../shared/atoms/buttons/iconButton/IconButton';
import { Chip } from '@mui/material';

import ImagePreview from '../../../shared/atoms/filePreview/ImagePreview';
import VideoPreview from '../../../shared/atoms/filePreview/VideoPreview';
import RenderFile from '../../../shared/organisms/renderFile/RenderFile';

import getEnvVariables from '../../../../config/configEnvs';
const { HOST } = getEnvVariables();

interface Props {
	message: any;
	solved: boolean;
	onVote(): void;
	onSolve(): void;

	onEdit?(message: any): void;
	onDelete?(message: any): void;
}

const HelpMessageCard: React.FC<Props> = ({
	message,
	solved,
	onVote,
	onSolve,
	onEdit,
	onDelete,
}) => {
	const rawPath: string | undefined =
		(message.attachments && message.attachments[0]) ||
		(message.fileUrl as string | undefined);

	const hasFile = Boolean(rawPath);
	const fileUrl = rawPath ? `${HOST}/${rawPath}` : null;

	const isImage = rawPath ? /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(rawPath) : false;
	const isVideo = rawPath ? /\.(mp4|webm|ogg|mov|m4v)$/i.test(rawPath) : false;
	const isPdf   = rawPath ? /\.pdf$/i.test(rawPath) : false;

	const rawFileType =
		isImage ? 'image/*' :
		isVideo ? 'video/*' :
		isPdf   ? 'application/pdf' :
		'application/octet-stream';

	return (
		<Paper elevation={0} sx={{ p: 2, mb: 2 }}>
			{/* HEADER */}
			<SmartBox row gap={1} alignItems="center">
				<AvatarX src={message.author?.profilePicture} size="sm" />
				<Text size="sm" weight="bold">
					{message.author?.username}
				</Text>
				<DateTimeInfo
					timestamp={message.created_at}
					size="small"
					variant="compact"
				/>

				{/* Botones Editar / Eliminar SIEMPRE visibles,
				    solo ejecutan si hay handler */}
				<SmartBox row gap="px2" alignItems="center">
					<IconButton
						ariaLabel="Editar respuesta"
						onClick={() => onEdit?.(message)}
					>
						<Edit fontSize="small" />
					</IconButton>

					<IconButton
						ariaLabel="Eliminar respuesta"
						onClick={() => onDelete?.(message)}
					>
						<Delete fontSize="small" color="error" />
					</IconButton>
				</SmartBox>
			</SmartBox>

			{/* BOTÓN / BADGE DE SOLUCIÓN */}
			{solved ? (
				<Chip
					icon={<CheckCircle />}
					label="Solución"
					color="success"
					size="small"
					sx={{ mt: 1 }}
				/>
			) : (
				<FilledButton
					variant="ghost"
					size="small"
					sx={{ mt: 1 }}
					onClick={onSolve}
				>
					Marcar como solución
				</FilledButton>
			)}

			{/* VOTOS */}
			<SmartBox row gap="px4" mt="px2" alignItems="center">
				<IconButton ariaLabel="Me gusta" onClick={onVote}>
					<ThumbUp fontSize="small" />
				</IconButton>
				<Text size="sm">{message.votes}</Text>
			</SmartBox>

			{/* TEXTO */}
			{message.content && (
				<Text size="sm" sx={{ mt: 1 }}>
					{message.content}
				</Text>
			)}

			{/* ARCHIVO */}
			{hasFile && fileUrl && (
				<SmartBox sx={{ mt: 2 }}>
					{isImage && (
						<ImagePreview
							src={fileUrl}
							alt="Imagen adjunta"
						/>
					)}

					{isVideo && (
						<VideoPreview
							src={fileUrl}
							type="video/mp4"
						/>
					)}

					{!isImage && !isVideo && (
						<RenderFile
							filePath={rawPath!}
							fileType={rawFileType}
							baseUrl={HOST}
							title={message.content || 'Archivo adjunto'}
							enableZoom={!isPdf}
							previewVariant="contain"
							maxFeedHeight="350px"
							buttonLabels={{
								viewPdf: 'Ver PDF',
								download: 'Descargar archivo',
							}}
						/>
					)}
				</SmartBox>
			)}
		</Paper>
	);
};

export default HelpMessageCard;

