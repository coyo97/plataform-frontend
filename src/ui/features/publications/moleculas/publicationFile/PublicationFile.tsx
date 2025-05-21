// features/publications/moleculas/publicationFile/PublicationFile.tsx
import React from 'react';
import { Box } from '@mui/material';

import VideoPreview from '../../../../shared/atoms/filePreview/VideoPreview';
import ImagePreview from '../../../../shared/atoms/filePreview/ImagePreview';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import { Publication } from '../../../../../types/publication';

interface Props {
	publication: Publication;
	baseUrl    : string;
}

const PublicationFile: React.FC<Props> = ({ publication, baseUrl }) => {
	const { filePath, fileType, title } = publication;
	if (!filePath || !fileType) return null;

	const url = `${baseUrl}/${filePath}`;

	return (
		<Box sx={{ display:'flex', justifyContent:'center', mt:2 }}>
			{fileType.startsWith('image/') && (
				<ImagePreview src={url} alt={title} />
			)}

			{fileType.startsWith('video/') && (
				<VideoPreview src={url} type={fileType} />
			)}

			{fileType === 'application/pdf' && (
				<FilledButton
					component="a"
					href={url}
					target="_blank"
					rel="noreferrer"
					colorType="success"
					size="small"
				>
					Ver PDF
				</FilledButton>
			)}

			{!fileType.startsWith('image/')
				&& !fileType.startsWith('video/')
				&& fileType !== 'application/pdf' && (
					<FilledButton
						component="a"
						href={url}
						download
						colorType="success"
						size="small"
					>
						Descargar archivo
					</FilledButton>
				)}
		</Box>
	);
};

export default PublicationFile;

