import SmartBox from '../../atoms/box/SmartBox';
import { SidebarProps } from './sidebar2.types';
import { useCallback, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

const Sidebar2: React.FC<SidebarProps> = ({
	open = true,
	onClose,
	width = 250,
	variant = 'default',
	children,
	sticky = false,
	position = 'left',
	header,
	footer
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const cssWidth = typeof width === 'number' ? `${width}px` : width;

	const background =
		variant === 'primary' ? 'primary.dark' :
		variant === 'surface' ? 'background.paper' :
		variant === 'elevated' ? 'background.paper' :
		variant === 'flat' ? 'transparent' : 'grey.100';

	const color = variant === 'primary' ? 'primary.contrastText' : 'text.primary';

	const shadow =
		variant === 'elevated' ? 'md' :
		variant === 'surface' ? 'sm' : undefined;

	const escListener = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Escape' && onClose) onClose();
	}, [onClose]);

	useEffect(() => {
		if (!onClose) return;
		document.addEventListener('keydown', escListener);
		return () => document.removeEventListener('keydown', escListener);
	}, [escListener, onClose]);

	// Lock scroll when open on mobile
	useEffect(() => {
		if (isMobile && open) document.body.style.overflow = 'hidden';
		return () => { document.body.style.overflow = ''; };
	}, [isMobile, open]);

	const slideTransform = !open && isMobile
		? (position === 'left' ? 'translateX(-100%)' : 'translateX(100%)')
		: 'translateX(0)';

	const shouldRender = open || isMobile;
	if (!shouldRender) return null;


		return (
			<>
				{onClose && open && isMobile && (
					<SmartBox
						onClick={onClose}
						aria-hidden="true"
						sx={{
							position: 'fixed',
							inset: 0,
							bgcolor: 'rgba(0,0,0,0.4)',
							zIndex: 1299
						}}
					/>
				)}

				<SmartBox
					role='navigation'
					p="px8"
					radius='sm4x'
					shadow={shadow}
					sx={{
						position: sticky ? 'sticky' : 'fixed',
						top: 0,
						[position]: 0,
						height: '100vh',
						width: cssWidth,
						boxSizing: 'border-box',
						bgcolor: background,
						color,
						zIndex: isMobile ? 1300 : 10,
						display: 'flex',
						flexDirection: 'column',
						transform: slideTransform,
						transition: isMobile ? 'transform 0.3s ease-in-out' : undefined,
					}}
				>
					{header ?? 'header...'}
					<SmartBox column m="px4" sx={{ flex: 1, overflowY: 'auto' }}>
						{children ?? 'contenido'}
					</SmartBox>
					{footer ?? 'footer...'}
				</SmartBox>
			</>
		);
};

export default Sidebar2;

