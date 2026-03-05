// ui/features/academicHelp/molecules/HelpMessageCard.tsx
import React from 'react';
import CommentCard from '../../../shared/organisms/commentCard/CommentCard';

import ImagePreview from '../../../shared/atoms/filePreview/ImagePreview';
import VideoPreview from '../../../shared/atoms/filePreview/VideoPreview';
import RenderFile from '../../../shared/organisms/renderFile/RenderFile';

import getEnvVariables from '../../../../config/configEnvs';
import { getUserId } from '../../../../utils/auth/getUserId';

const { HOST } = getEnvVariables();

interface Props {
	message: any;
	solved: boolean;
	onVote(): void;
	onSolve(): void;

	onEdit?(message: any): void;
	onDelete?(message: any): void;
	canSolve?: boolean;
}

const HelpMessageCard: React.FC<Props> = ({
	message,
	solved,
	onVote,
	onSolve,
	onEdit,
	onDelete,
	canSolve = false,
}) => {
	const currentUserId = getUserId();

	const author = message.author;
	const messageAuthorId =
		typeof author === 'string'
			? author
			: author?._id || author?.id || author?.userId;

			const isOwner =
				currentUserId &&
				messageAuthorId &&
				String(currentUserId) === String(messageAuthorId);

			// -------------------------------
			// Adjuntos
			// -------------------------------
			const rawPath: string | undefined =
				(message.attachments && message.attachments[0]) ||
				(message.fileUrl as string | undefined);

			let attachmentNode: React.ReactNode = null;

			if (rawPath) {
				const fileUrl = `${HOST}/${rawPath}`;

				const isImage = /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(rawPath);
				const isVideo = /\.(mp4|webm|ogg|mov|m4v)$/i.test(rawPath);
				const isPdf   = /\.pdf$/i.test(rawPath);

				if (isImage) {
					attachmentNode = <ImagePreview src={fileUrl} alt="Imagen adjunta" />;
				} else if (isVideo) {
					attachmentNode = <VideoPreview src={fileUrl} type="video/mp4" />;
				} else {
					attachmentNode = (
						<RenderFile
							filePath={rawPath}
							fileType={
								isPdf
									? 'application/pdf'
									: 'application/octet-stream'
							}
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
					);
				}
			}

			return (
				<CommentCard
					author={{
						name: message.author?.username,
						avatarUrl: message.author?.profilePicture,
					}}
					date={message.created_at}
					content={message.content}
					attachment={attachmentNode}
					solved={solved}
					canSolve={canSolve}
					onSolve={onSolve}
					votes={message.votes}
					onVote={onVote}
					isOwner={isOwner}
					onEdit={() => onEdit?.(message)}
					onDelete={() => onDelete?.(message)}
				/>
			);
};

export default HelpMessageCard;

