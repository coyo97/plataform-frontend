import React, { useCallback, useState, useRef } from 'react';
import { Box, Dialog, IconButton, Stack, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';

import ImagePreview from '../../atoms/filePreview/ImagePreview';
import VideoPreview from '../../atoms/filePreview/VideoPreview';
import FilledButton from '../../atoms/buttons/filledButton/FilledButton';

import { FileWrapper, OverlayLabel, DialogContainer, DialogImageBox, ZoomImage,ZoomStage } from './renderFile.styles';
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
		const [scale, setScale] = useState(1);
	const [tx, setTx] = useState(0);
	const [ty, setTy] = useState(0);
	const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; startTx: number; startTy: number }>({
		dragging: false,
		startX: 0,
		startY: 0,
		startTx: 0,
		startTy: 0,
	});
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


	const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
	const zoomIn  = () => setScale((s) => clamp(Number((s + 0.2).toFixed(2)), 1, 6));
	const zoomOut = () => setScale((s) => clamp(Number((s - 0.2).toFixed(2)), 1, 6));
	const reset   = () => { setScale(1); setTx(0); setTy(0); };

	const onWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const dir = e.deltaY > 0 ? -0.2 : 0.2;
		setScale((s) => clamp(Number((s + dir).toFixed(2)), 1, 6));
	};

	const onMouseDown = (e: React.MouseEvent) => {
		if (scale <= 1) return;
		dragRef.current = {
			dragging: true,
			startX: e.clientX,
			startY: e.clientY,
			startTx: tx,
			startTy: ty,
		};
	};
	const onMouseMove = (e: React.MouseEvent) => {
		if (!dragRef.current.dragging) return;
		setTx(dragRef.current.startTx + (e.clientX - dragRef.current.startX));
		setTy(dragRef.current.startTy + (e.clientY - dragRef.current.startY));
	};
	const endDrag = () => { dragRef.current.dragging = false; };

	const onDoubleClick = () => {
		if (scale === 1) { setScale(2); }
		else { reset(); }
	};

	// Accesos rápidos de teclado dentro del dialog
	const onDialogKey = (e: React.KeyboardEvent) => {
		if (e.key.toLowerCase() === 'x') return handleClose();
		if (e.key === '+') { e.preventDefault(); zoomIn(); }
		if (e.key === '-') { e.preventDefault(); zoomOut(); }
		if (e.key === '0') { e.preventDefault(); reset(); }
	};


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
						onKeyDown={onDialogKey}
					>
						{/* Botones (cerrar + zoom) */}
						<Stack
							direction="row"
							spacing={1}
							sx={(theme) => ({
								position: 'absolute',
								top: 8,
								right: 8,
								zIndex: 2,
								bgcolor: theme.palette.background.paper,
								boxShadow: theme.shadows[2],
								borderRadius: 999,
								p: 0.5,
							})}
						>
							<Tooltip title="Alejar (−)">
								<span>
									<IconButton size="small" onClick={zoomOut} aria-label="Alejar" disabled={scale <= 1}>
										<RemoveIcon fontSize="small" />
									</IconButton>
								</span>
							</Tooltip>
							<Tooltip title="Acercar (+)">
								<IconButton size="small" onClick={zoomIn} aria-label="Acercar">
									<AddIcon fontSize="small" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Restablecer (0)">
								<IconButton size="small" onClick={reset} aria-label="Restablecer">
									<RefreshIcon fontSize="small" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Cerrar (X)">
								<IconButton size="small" onClick={handleClose} aria-label="Cerrar">
									<CloseIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</Stack>

						<DialogContainer onClick={handleClose} role="presentation">
							<ZoomStage
								onClick={(e) => e.stopPropagation()}
								onWheel={onWheel}
								onMouseDown={onMouseDown}
								onMouseMove={onMouseMove}
								onMouseUp={endDrag}
								onMouseLeave={endDrag}
								onDoubleClick={onDoubleClick}
							>
								<ZoomImage
									src={url}
									alt={altText}
									loading="lazy"
									decoding="async"
									draggable={false}
									$scale={scale}
									$tx={tx}
									$ty={ty}
									onDragStart={(e) => e.preventDefault()}
								/>
							</ZoomStage>
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

