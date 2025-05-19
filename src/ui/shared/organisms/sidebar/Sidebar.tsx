// Sidebar.tsx
import React, { useEffect, useCallback } from 'react';
import { SidebarContainer, SidebarContent, Overlay } from './sidebar.styles';
import { SidebarProps } from './sidebar.types';
import IconButton from '../../atoms/buttons/iconButton/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar: React.FC<SidebarProps> = ({
	open = true,
	onClose,
	sticky = false,
	width = 250,
	variant = 'default',
	header,
	footer,
	children,
	position = 'left',
}) => {
	/* Cerrar con tecla Esc */
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

	return (
		<>
			{/* Overlay para móvil */}
			{onClose && open && (
				<Overlay
					role="presentation"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}

			<SidebarContainer
				role="navigation"
				aria-hidden={!open}
				open={open}
				sticky={sticky}
				width={typeof width === 'number' ? `${width}px` : width}
				variant={variant}
				position={position}
			>
				{/* Botón hamburguesa (móvil) */}
				{onClose && (
					<IconButton
						ariaLabel="Cerrar menú"
						onClick={onClose}
						sizeType="sm"
						colorType="primary"
						shape="square"
						sx={{ display: { sm: 'none', xs: 'block' }, alignSelf: 'flex-end' }}
					>
						<MenuIcon />
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

