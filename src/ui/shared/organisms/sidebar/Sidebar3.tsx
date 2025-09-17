import { Sidebar2Container, Sidebar2Content, Sidebar2Overlay } from './sidebar2.styles';
import { SidebarProps } from './sidebar2.types';
import IconButton from '../../atoms/buttons/iconButton/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar3: React.FC<SidebarProps> = ({
	open = true,
	width = 250,
	variant = 'default',
	onClose,
	position = 'left',
	sticky = false,
	header,
	footer,
	children,
}) => {
	if (!open) return null;

	const cssWidth = typeof width === 'number' ? `${width}px` : width;

	return (
		<>
			{onClose && open && (
				<Sidebar2Overlay role="presentation" aria-hidden="true" onClick={() => onClose?.()} />
			)}

			<Sidebar2Container
				role="navigation"
				open={open}
				sticky={sticky}
				width={cssWidth}
				variant={variant}
				position={position}
			>
				{/* Mobile hamburger close button */}
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
				<Sidebar2Content>{children}</Sidebar2Content>
				{footer && <div>{footer}</div>}
			</Sidebar2Container>
		</>
	);
};

export default Sidebar3;

