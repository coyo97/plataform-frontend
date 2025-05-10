import React from 'react';
import { Box } from '@mui/material';
import { Publication } from '../../../../../types/publication';

interface Props {
	publication: Publication;
	baseUrl: string; // ej. HOST
}

const PublicationFile: React.FC<Props> = ({ publication, baseUrl }) => {
	const { filePath, fileType, title } = publication;
	if (!filePath || !fileType) return null;

	const url = `${baseUrl}/${filePath}`;

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
			{fileType.startsWith('image/') && (
				<img
					src={url}
					alt={title}
					style={{ width: '100%', maxWidth: 500, borderRadius: 8 }}
				/>
			)}

			{fileType.startsWith('video/') && (
				<video
					controls
					style={{ width: '100%', maxWidth: 500, borderRadius: 8 }}
				>
					<source src={url} type={fileType} />
				</video>
			)}

			{fileType === 'application/pdf' && (
				<a href={url} target="_blank" rel="noreferrer">
					Ver PDF
				</a>
			)}

			{!fileType.startsWith('image/') &&
				!fileType.startsWith('video/') &&
				fileType !== 'application/pdf' && (
					<a href={url} download>
						Descargar archivo
					</a>
				)}
		</Box>
	);
};

export default PublicationFile;

