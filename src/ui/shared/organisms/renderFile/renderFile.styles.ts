import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const FileWrapper = styled(Box, {
	shouldForwardProp: (prop) =>
		!['$clickable', '$maxFeedHeight', '$previewVariant'].includes(String(prop)),
})<{
	$clickable?: boolean;
	$maxFeedHeight?: string | number;
	$previewVariant?: 'cover' | 'contain';
}>(({ theme, $clickable = true, $maxFeedHeight = 'min(60vh, 520px)', $previewVariant = 'cover' }) => ({
	display: 'inline-block',
	borderRadius: theme.shape?.borderRadius ?? 8,
	overflow: 'hidden',
	position: 'relative',
	transform: 'translateZ(0)',
	boxShadow: theme.shadows[1],
	transition: 'box-shadow 140ms ease, transform 140ms ease',
	...( $clickable ? { cursor: 'zoom-in' } : {}),

	// limitar altura en feed para que no tape acciones/comentarios
	maxHeight: $maxFeedHeight,

	// asegurar adaptación del contenido embebido
	'& img, & video, & picture': {
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: $previewVariant, // 'cover' o 'contain'
		backgroundColor: theme.palette.background.default,
	},

	'&:hover': $clickable ? {
		boxShadow: theme.shadows[3],
		transform: 'scale(1.01)',
	} : undefined,

	'&:active': $clickable ? {
		transform: 'scale(0.995)',
	} : undefined,

	'&:focus-visible': {
		outline: 'none',
		boxShadow: `0 0 0 3px ${theme.palette.primary.main}33, ${theme.shadows[2]}`,
	},

	[theme.breakpoints.down('sm')]: {
		maxHeight: '50vh',
	},
}));

export const OverlayLabel = styled(Box)(({ theme }) => ({
	pointerEvents: 'none',
	position: 'absolute',
	left: 0,
	right: 0,
	bottom: 0,
	height: 56,
	background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 100%)',
	display: 'flex',
	alignItems: 'flex-end',
	justifyContent: 'flex-end',
	padding: theme.spacing(1),

	'& .overlay-chip': {
		pointerEvents: 'none',
		color: '#fff',
		fontSize: theme.typography.pxToRem(12),
		opacity: 0.9,
		background: 'rgba(0,0,0,.25)',
		borderRadius: 999,
		padding: `${theme.spacing(0.25)} ${theme.spacing(1)}`,
	},
}));

export const DialogContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(1),
	[theme.breakpoints.up('sm')]: {
		padding: theme.spacing(2),
	},
}));

export const DialogImageBox = styled(Box)(({ theme }) => ({
	position: 'relative',
	maxWidth: '90vw',
	maxHeight: '90vh',
	borderRadius: theme.shape?.borderRadius ?? 8,
	// Antes: overflow: 'hidden'
	overflow: 'auto',             // ⬅ permite scroll si la imagen es más grande
	boxShadow: theme.shadows[6],
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',

	'& img': {
		display: 'block',
		// Antes: width: '100%', height: '100%'
		width: 'auto',               // ⬅ deja que la imagen use su tamaño natural
		height: 'auto',              // ⬅ (sin forzar alto)
		maxWidth: '100%',            // ⬅ limita a viewport cuando es enorme
		maxHeight: '100%',           // ⬅ limita a viewport cuando es enorme
		objectFit: 'contain',
		backgroundColor: theme.palette.background.default,
	},
}));

export const ZoomStage = styled(Box)(({ theme }) => ({
	position: 'relative',
	maxWidth: '90vw',
	maxHeight: '90vh',
	borderRadius: theme.shape?.borderRadius ?? 8,
	overflow: 'hidden',                 
	boxShadow: theme.shadows[6],
	backgroundColor: theme.palette.background.default,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	touchAction: 'none',               
}));

export const ZoomImage = styled('img', {
	shouldForwardProp: (prop) => !['$scale', '$tx', '$ty'].includes(String(prop)),
})<{
	$scale: number;
	$tx: number;
	$ty: number;
}>(({ $scale, $tx, $ty }) => ({
	display: 'block',
	width: 'auto',
	height: 'auto',
	maxWidth: '90vw',
	maxHeight: '90vh',
	objectFit: 'contain',
	userSelect: 'none',
	pointerEvents: 'auto',
	transform: `translate3d(${$tx}px, ${$ty}px, 0) scale(${$scale})`,
	transformOrigin: 'center center',
	cursor: $scale > 1 ? 'grab' : 'default',
}));
