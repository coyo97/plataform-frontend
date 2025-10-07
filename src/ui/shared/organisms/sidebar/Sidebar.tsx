import React, { useEffect, useCallback } from 'react';
import { SidebarContainer, SidebarContent, Overlay } from './sidebar.styles';
import { SidebarProps } from './sidebar.types';
import IconButton from '../../atoms/buttons/iconButton/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar: React.FC<SidebarProps> = ({
	open = true,
	onClose,
	sticky = false,
	width = 180,
	variant = 'default',
	header,
	footer,
	children,
	position = 'left',
	ariaLabel = 'Menú lateral',
}) => {
	// Cerrar con tecla Esc
	const escListener = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape' && onClose) onClose();
		},
		[onClose],
	);

	useEffect(() => {
		document.addEventListener('keydown', escListener);
		return () => document.removeEventListener('keydown', escListener);
	}, [escListener]);

	// Bloquear scroll al abrir en modo modal
	useEffect(() => {
		if (variant !== 'modal') return;
		const prev = document.body.style.overflow;
		if (open) document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open, variant]);

	return (
		<>
			{/* Overlay en modal */}
			{onClose && open && variant === 'modal' && (
				<Overlay role="presentation" onClick={onClose} aria-hidden="true" />
			)}

			<SidebarContainer
				role={variant === 'modal' ? 'dialog' : 'navigation'}
				aria-modal={variant === 'modal' ? 'true' : undefined}
				aria-label={ariaLabel}
				aria-hidden={variant === 'modal' ? undefined : !open}
				open={open}
				sticky={sticky}
				width={typeof width === 'number' ? `${width}px` : width}
				variant={variant}
				position={position}
			>
				{/* Botón de cerrar en móvil */}
				{onClose && variant === 'modal' && (
					<IconButton
						ariaLabel="Cerrar menú"
						onClick={onClose}
						sizeType="sm"
						colorType="primary"
						shape="square"
						sx={{ display: { sm: 'none', xs: 'block' }, alignSelf: 'flex-end' }}
					>
						<CloseIcon />
					</IconButton>
				)}

				{header && <div>{header}</div>}
				<SidebarContent>{children}</SidebarContent>
				{footer && <div>{footer}</div>}
			</SidebarContainer>
		</>
	);
};

export default Sidebar;

