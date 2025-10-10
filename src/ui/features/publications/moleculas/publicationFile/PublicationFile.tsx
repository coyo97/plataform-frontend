// features/publications/moleculas/publicationFile/PublicationFile.tsx
import React from 'react';
import RenderFile from '../../../../shared/organisms/renderFile/RenderFile';
import { Publication } from '../../../../../types/publication';

interface Props {
	publication: Publication;
	baseUrl    : string;
}

const PublicationFile: React.FC<Props> = ({ publication, baseUrl }) => {
	const { filePath, fileType, title, author } = publication;
	if (!filePath || !fileType) return null;

	return (
		<RenderFile
			filePath={filePath}
			fileType={fileType}
			title={title}
			authorName={author?.username}

			baseUrl={baseUrl}
			enableZoom
			elevation={1}
			maxFeedHeight="min(60vh, 520px)"
			previewVariant="cover"
		/>
	);
};

export default PublicationFile;

