import React, { useCallback, useState } from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import ImagePreview from '../../atoms/filePreview/ImagePreview';
import VideoPreview from '../../atoms/filePreview/VideoPreview';
import FilledButton from '../../atoms/buttons/filledButton/FilledButton';

import { FileWrapper, OverlayLabel, DialogContainer, DialogImageBox } from './renderFile.styles';
import { RenderFileProps } from './renderFile.types';

const RenderFile: React.FC<RenderFileProps> = ({
	filePath,
	fileType,
	title,
	baseUrl,
	authorName,
	elevation = 1,
	enableZoom = true,
	maxFeedHeight,
	previewVariant = 'cover',
	onOpenPreview,
	onClosePreview,
	buttonLabels,
	belowSlot,
}) => {
	// Hooks SIEMPRE al inicio
	const [open, setOpen] = useState(false);
	const handleOpen = useCallback(() => {
		if (!enableZoom) return;
		onOpenPreview?.();
		setOpen(true);
	}, [enableZoom, onOpenPreview]);

	const handleClose = useCallback(() => {
		setOpen(false);
		onClosePreview?.();
	}, [onClosePreview]);

	const handleKey = useCallback((e: React.KeyboardEvent) => {
		if (!enableZoom) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onOpenPreview?.();
			setOpen(true);
		}
	}, [enableZoom, onOpenPreview]);

	// Guardas
	const hasFile = Boolean(filePath && fileType);
	if (!hasFile) return null;

	const url = `${baseUrl}/${filePath}`;
	const ft = fileType || '';
	const isImage = ft.startsWith('image/');
	const isVideo = ft.startsWith('video/');
	const isPdf   = ft === 'application/pdf';

	const labels = {
		viewPdf: buttonLabels?.viewPdf ?? 'Ver PDF',
		download: buttonLabels?.download ?? 'Descargar archivo',
	};

	const altText =
		(title && title.trim()) ||
		(authorName ? `Imagen publicada por ${authorName}` : 'Imagen publicada');

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
			{/* IMAGEN */}
			{isImage && (
				<>
					<FileWrapper
						role={enableZoom ? 'button' : undefined}
						aria-label={enableZoom ? 'Ampliar imagen' : altText}
						tabIndex={enableZoom ? 0 : -1}
						onClick={enableZoom ? handleOpen : undefined}
						onKeyDown={enableZoom ? handleKey : undefined}
						sx={(theme) => ({
							boxShadow: theme.shadows[elevation],
						})}
						$clickable={enableZoom}
						$maxFeedHeight={maxFeedHeight}
						$previewVariant={previewVariant}
					>
						{/* Usa átomo existente */}
						<ImagePreview src={url} alt={altText} />

						{enableZoom && (
							<OverlayLabel aria-hidden>
								<Box className="overlay-chip">Ver completa ⤢</Box>
							</OverlayLabel>
						)}
					</FileWrapper>

					{/* Lightbox/Dialog para imagen */}
					<Dialog
						open={open}
						onClose={handleClose}
						fullWidth
						maxWidth="lg"
						aria-label="Vista ampliada de la imagen"
						PaperProps={{
							sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible' },
						}}
						onKeyDown={(e) => {
							if (e.key.toLowerCase() === 'x') handleClose();
						}}
					>
						{/* Botón cerrar (X) */}
						<IconButton
							aria-label="Cerrar"
							onClick={handleClose}
							sx={(theme) => ({
								position: 'absolute',
								top: 8,
								right: 8,
								zIndex: 1,
								bgcolor: theme.palette.background.paper,
								boxShadow: theme.shadows[2],
								'&:hover': { bgcolor: theme.palette.background.paper },
							})}
						>
							<CloseIcon />
						</IconButton>

						<DialogContainer onClick={handleClose} role="presentation">
							<DialogImageBox onClick={(e) => e.stopPropagation()}>
								<img src={url} alt={altText} loading="lazy" decoding="async" />
							</DialogImageBox>
						</DialogContainer>
					</Dialog>
				</>
			)}

			{/* VIDEO */}
			{isVideo && (
				<FileWrapper
					aria-label={title || 'Video publicado'}
					tabIndex={-1}
					$clickable={false}
					$maxFeedHeight={maxFeedHeight}
					$previewVariant="contain"
					sx={(theme) => ({ boxShadow: theme.shadows[elevation] })}
				>
					<VideoPreview src={url} type={ft} />
				</FileWrapper>
			)}

			{/* PDF */}
			{isPdf && (
				<FilledButton
					component="a"
					href={url}
					target="_blank"
					rel="noreferrer"
					colorType="success"
					size="small"
					sx={{ alignSelf: 'flex-start' }}
				>
					{labels.viewPdf}
				</FilledButton>
			)}

			{/* OTROS ARCHIVOS */}
			{!isImage && !isVideo && !isPdf && (
				<FilledButton
					component="a"
					href={url}
					download
					colorType="success"
					size="small"
					sx={{ alignSelf: 'flex-start' }}
				>
					{labels.download}
				</FilledButton>
			)}

			{belowSlot}
		</Box>
	);
};

export default RenderFile;

