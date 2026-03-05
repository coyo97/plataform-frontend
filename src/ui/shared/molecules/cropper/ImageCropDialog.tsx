// src/ui/shared/molecules/cropper/ImageCropDialog.tsx
import React, { useRef, useState, useCallback, useEffect, type CSSProperties, } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, } from '@mui/material';

type ImageCropDialogProps = {
	open   : boolean;
	src    : string;
	onClose: () => void;
	onApply: (file: File, previewUrl: string) => void;
};

type CropRect = {
	x     : number;
	y     : number;
	width : number;
	height: number;
};

type DragHandle = | 'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

type DragState = {
	handle   : DragHandle;
	startX   : number;
	startY   : number;
	startCrop: CropRect;
};

type DrawState = {
	drawing : boolean;
	pointerId: number | null;
	lastX   : number;
	lastY   : number;
};

const MIN_SIZE = 40;

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
	open,
	src,
	onClose,
	onApply,
}) => {
	const imgRef     = useRef<HTMLImageElement | null>(null);
	const canvasRef  = useRef<HTMLCanvasElement | null>(null);

	const [imgBox, setImgBox] = useState({ width: 0, height: 0 });

	const hasInitializedCropRef = useRef(false);

	const [crop, setCrop]   = useState<CropRect | null>(null);
	const [drag, setDrag]   = useState<DragState | null>(null);

	const [mode, setMode]   = useState<'crop' | 'draw'>('crop');
	const [drawState, setDrawState] = useState<DrawState>({
		drawing : false,
		pointerId: null,
		lastX   : 0,
		lastY   : 0,
	});

	const initCropFromBox = useCallback(
		(box: { width: number; height: number }) => {
			const marginX = box.width * 0.15;
			const marginY = box.height * 0.15;

			const initial: CropRect = {
				x     : marginX,
				y     : marginY,
				width : box.width  - marginX * 2,
				height: box.height - marginY * 2,
			};

			setCrop(initial);
		},
		[]
	);

	useEffect(() => {
		if (!imgBox.width || !imgBox.height) return;
		if (hasInitializedCropRef.current) return;

		initCropFromBox(imgBox);
		hasInitializedCropRef.current = true;
	}, [imgBox.width, imgBox.height, initCropFromBox]);

	useEffect(() => {
		if (!open) return;
		hasInitializedCropRef.current = false;
		setCrop(null);
		setMode('crop'); // modo por defecto al abrir
	}, [open]);

	useEffect(() => {
		hasInitializedCropRef.current = false;
		setCrop(null);
		setMode('crop');
	}, [src]);

	const clampCrop = useCallback(
		(c: CropRect): CropRect => {
			const { width: imgW, height: imgH } = imgBox;
			if (!imgW || !imgH) return c;

			let { x, y, width, height } = c;

			width  = Math.max(width, MIN_SIZE);
			height = Math.max(height, MIN_SIZE);

			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if (x + width  > imgW) x = imgW - width;
			if (y + height > imgH) y = imgH - height;

			return { x, y, width, height };
		},
		[imgBox]
	);

	const handlePointerDown =
		(handle: DragHandle) => (e: React.PointerEvent<HTMLDivElement>) => {
			if (!crop) return;

			e.preventDefault();
			e.stopPropagation();

			const pointerId = e.pointerId;
			try {
				(e.currentTarget as HTMLElement).setPointerCapture(pointerId);
			} catch {}

			setDrag({
				handle,
				startX   : e.clientX,
				startY   : e.clientY,
				startCrop: { ...crop },
			});
		};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!drag || mode !== 'crop') return;

		const { handle, startX, startY, startCrop } = drag;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;

		let next: CropRect = { ...startCrop };

		switch (handle) {
			case 'move':
				next.x = startCrop.x + dx;
				next.y = startCrop.y + dy;
				break;

			case 'e':
				next.width = startCrop.width + dx;
				break;

			case 'w':
				next.x     = startCrop.x + dx;
				next.width = startCrop.width - dx;
				break;

			case 's':
				next.height = startCrop.height + dy;
				break;

			case 'n':
				next.y      = startCrop.y + dy;
				next.height = startCrop.height - dy;
				break;

			case 'se':
				next.width  = startCrop.width + dx;
				next.height = startCrop.height + dy;
				break;

			case 'sw':
				next.x      = startCrop.x + dx;
				next.width  = startCrop.width - dx;
				next.height = startCrop.height + dy;
				break;

			case 'ne':
				next.y      = startCrop.y + dy;
				next.height = startCrop.height - dy;
				next.width  = startCrop.width + dx;
				break;

			case 'nw':
				next.x      = startCrop.x + dx;
				next.y      = startCrop.y + dy;
				next.width  = startCrop.width - dx;
				next.height = startCrop.height - dy;
				break;
		}

		setCrop(clampCrop(next));
	};

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!drag) return;
		const pointerId = e.pointerId;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(pointerId);
		} catch {}
		setDrag(null);
	};


	const loadImageOnCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.src = src;
		img.onload = () => {
			const maxWidth  = 600;
			const maxHeight = 400;

			let width  = img.width;
			let height = img.height;
			const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

			width  = width * ratio;
			height = height * ratio;

			canvas.width  = width;
			canvas.height = height;

			ctx.clearRect(0, 0, width, height);
			ctx.drawImage(img, 0, 0, width, height);

			ctx.lineWidth   = 3;
			ctx.lineCap     = 'round';
			ctx.strokeStyle = '#ff3b30'; // rojo tipo marcador
		};

		setDrawState({
			drawing : false,
			pointerId: null,
			lastX   : 0,
			lastY   : 0,
		});
	}, [src]);

	useEffect(() => {
		if (!open) return;
		if (mode !== 'draw') return;
		loadImageOnCanvas();
	}, [open, mode, loadImageOnCanvas]);

	const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return { x: 0, y: 0 };
		const rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	};

	const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas || mode !== 'draw') return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const { x, y } = getCanvasPos(e);

		canvas.setPointerCapture(e.pointerId);

		ctx.beginPath();
		ctx.moveTo(x, y);

		setDrawState({
			drawing : true,
			pointerId: e.pointerId,
			lastX   : x,
			lastY   : y,
		});
	};

	const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas || mode !== 'draw') return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		setDrawState(prev => {
			if (!prev.drawing || prev.pointerId !== e.pointerId) return prev;

			const { x, y } = getCanvasPos(e);
			ctx.lineTo(x, y);
			ctx.stroke();

			return {
				...prev,
				lastX: x,
				lastY: y,
			};
		});
	};

	const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (canvas && drawState.pointerId != null) {
			try {
				canvas.releasePointerCapture(drawState.pointerId);
			} catch {}
		}
		setDrawState({
			drawing : false,
			pointerId: null,
			lastX   : 0,
			lastY   : 0,
		});
	};

	const handleClearDrawing = () => {
		loadImageOnCanvas();
	};


	const handleApply = () => {
		if (mode === 'draw') {
			const canvas = canvasRef.current;
			if (!canvas) return;

			canvas.toBlob(
				(blob) => {
					if (!blob) return;

					const file = new File([blob], 'image-annotated.jpg', {
						type: 'image/jpeg',
					});
					const url = URL.createObjectURL(file);
					onApply(file, url);
				},
				'image/jpeg',
				0.92
			);
			return;
		}

		if (!imgRef.current || !crop || !imgBox.width || !imgBox.height) return;

		const img = imgRef.current;

		const naturalW = img.naturalWidth;
		const naturalH = img.naturalHeight;

		const scaleX = naturalW / imgBox.width;
		const scaleY = naturalH / imgBox.height;

		const sx = crop.x * scaleX;
		const sy = crop.y * scaleY;
		const sw = crop.width  * scaleX;
		const sh = crop.height * scaleY;

		const canvas = document.createElement('canvas');
		canvas.width  = sw;
		canvas.height = sh;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

		canvas.toBlob(
			(blob) => {
				if (!blob) return;

				const file = new File([blob], 'image-cropped.jpg', {
					type: 'image/jpeg',
				});

				const url = URL.createObjectURL(file);
				onApply(file, url);
			},
			'image/jpeg',
			0.92
		);
	};

	const handleImageRef = (el: HTMLImageElement | null) => {
		imgRef.current = el;
		if (!el) return;

		requestAnimationFrame(() => {
			const rect = el.getBoundingClientRect();
			setImgBox({ width: rect.width, height: rect.height });
		});
	};

	const cropKey =
		crop
			? `${Math.round(crop.x)}-${Math.round(crop.y)}-${Math.round(
					crop.width
			  )}-${Math.round(crop.height)}`
			: 'no-crop';

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				{mode === 'crop' ? 'Recortar imagen' : 'Pintar sobre la imagen'}
			</DialogTitle>

			<DialogContent dividers>
				{/* Toggle simple de modo */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						gap: 1,
						mb: 2,
					}}
				>
					<Button
						size="small"
						variant={mode === 'crop' ? 'contained' : 'outlined'}
						onClick={() => setMode('crop')}
					>
						Recortar
					</Button>
					<Button
						size="small"
						variant={mode === 'draw' ? 'contained' : 'outlined'}
						onClick={() => setMode('draw')}
					>
						Pintar
					</Button>
				</Box>

				{/* MODO RECORTE */}
				{mode === 'crop' && (
					<Box
						sx={{
							position: 'relative',
							maxWidth: '100%',
							maxHeight: 360,
							margin: '0 auto',
							overflow: 'hidden',
							borderRadius: 2,
							userSelect: 'none',
							touchAction: 'none',
						}}
					>
						<img
							ref={handleImageRef}
							src={src}
							alt="Para recortar"
							style={{
								maxWidth : '100%',
								maxHeight: '360px',
								display  : 'block',
								objectFit: 'contain',
							}}
						/>

						{crop && (
							<Box
								key={cropKey}
								sx={{
									position: 'absolute',
									left : crop.x,
									top  : crop.y,
									width: crop.width,
									height: crop.height,
									border: '2px solid #fff',
									boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
									cursor: drag ? 'grabbing' : 'grab',
								}}
								onPointerDown={handlePointerDown('move')}
								onPointerMove={handlePointerMove}
								onPointerUp={handlePointerUp}
							>
								{/* Esquinas */}
								{(['nw', 'ne', 'sw', 'se'] as DragHandle[]).map((h) => {
									const pos: Record<string, CSSProperties> = {
										nw: { top: -6, left: -6, cursor: 'nwse-resize' },
										ne: { top: -6, right: -6, cursor: 'nesw-resize' },
										sw: { bottom: -6, left: -6, cursor: 'nesw-resize' },
										se: { bottom: -6, right: -6, cursor: 'nwse-resize' },
									};
									return (
										<div
											key={h}
											onPointerDown={handlePointerDown(h)}
											onPointerMove={handlePointerMove}
											onPointerUp={handlePointerUp}
											style={{
												position: 'absolute',
												width: 12,
												height: 12,
												borderRadius: 999,
												background: '#fff',
												border: '1px solid #000',
												...pos[h],
											}}
										/>
									);
								})}

								{/* Lados */}
								<div
									onPointerDown={handlePointerDown('n')}
									onPointerMove={handlePointerMove}
									onPointerUp={handlePointerUp}
									style={{
										position: 'absolute',
										top: -4,
										left: '50%',
										transform: 'translateX(-50%)',
										width: 16,
										height: 8,
										borderRadius: 4,
										background: '#fff',
										border: '1px solid #000',
										cursor: 'ns-resize',
									}}
								/>
								<div
									onPointerDown={handlePointerDown('s')}
									onPointerMove={handlePointerMove}
									onPointerUp={handlePointerUp}
									style={{
										position: 'absolute',
										bottom: -4,
										left: '50%',
										transform: 'translateX(-50%)',
										width: 16,
										height: 8,
										borderRadius: 4,
										background: '#fff',
										border: '1px solid #000',
										cursor: 'ns-resize',
									}}
								/>
								<div
									onPointerDown={handlePointerDown('w')}
									onPointerMove={handlePointerMove}
									onPointerUp={handlePointerUp}
									style={{
										position: 'absolute',
										left: -4,
										top: '50%',
										transform: 'translateY(-50%)',
										width: 8,
										height: 16,
										borderRadius: 4,
										background: '#fff',
										border: '1px solid #000',
										cursor: 'ew-resize',
									}}
								/>
								<div
									onPointerDown={handlePointerDown('e')}
									onPointerMove={handlePointerMove}
									onPointerUp={handlePointerUp}
									style={{
										position: 'absolute',
										right: -4,
										top: '50%',
										transform: 'translateY(-50%)',
										width: 8,
										height: 16,
										borderRadius: 4,
										background: '#fff',
										border: '1px solid #000',
										cursor: 'ew-resize',
									}}
								/>
							</Box>
						)}
					</Box>
				)}

				{/* MODO PINTAR */}
				{mode === 'draw' && (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 1.5,
						}}
					>
						<canvas
							ref={canvasRef}
							style={{
								maxWidth : '100%',
								maxHeight: 400,
								borderRadius: 8,
								border: '1px solid rgba(0,0,0,0.15)',
								touchAction: 'none',
							}}
							onPointerDown={handleCanvasPointerDown}
							onPointerMove={handleCanvasPointerMove}
							onPointerUp={handleCanvasPointerUp}
							onPointerCancel={handleCanvasPointerUp}
						/>
						<Box sx={{ fontSize: 13, opacity: 0.8, textAlign: 'center' }}>
							Dibuja con el mouse o con el dedo para señalar partes importantes.
						</Box>
						<Button size="small" onClick={handleClearDrawing}>
							Limpiar dibujo
						</Button>
					</Box>
				)}
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancelar</Button>
				<Button variant="contained" onClick={handleApply}>
					{mode === 'crop' ? 'Aplicar recorte' : 'Aplicar dibujo'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ImageCropDialog;

