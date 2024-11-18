import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header as StyledHeader, MenuButton, MenuIconStyled, NotificationsButton, NotificationsIconStyled, NotificationsContainer } from './header.styles';
import Notifications from '../centerAlert/Notifications'; // Asegúrate de la ruta correcta
import Logo from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png'; // Importa el logo

const Header: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);

	const toggleMobileMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const toggleNotifications = () => {
		setShowNotifications(!showNotifications);
	};
	const userRole = localStorage.getItem('roles');
	return (
		<StyledHeader isMenuOpen={isMenuOpen}>
			<nav>
				{/* Botón del menú en móviles */}
				<MenuButton onClick={toggleMobileMenu}>
					<MenuIconStyled />
				</MenuButton>

				{/* Logo */}
				<div className="logo">
					<Link to="/plataform">
						<img src={Logo} alt="Logo Universidad Autónoma Tomás Frías" style={{ height: '40px' }} /> {/* Ajusta el tamaño si es necesario */}
					</Link>
				</div>

				{/* Menú de navegación */}
				<ul>
					{/* Condicionalmente renderizar la opción "Administrador" */}
					{userRole === 'admi' && (
						<li><Link to="/administrator">Administrador</Link></li>
					)}
					<li><Link to='/profile'>Estudiante</Link></li>
					<li><Link to='/material-user'>Material</Link></li>
					<li><Link to='/message'>Mensajería</Link></li>
					<li><Link to='/stream-academi'>Ayuda Académica</Link></li>
					<li><Link to='/publications'>Publicaciones</Link></li>
				</ul>

				{/* Botón de notificaciones */}
				<NotificationsButton onClick={toggleNotifications}>
					<NotificationsIconStyled />
				</NotificationsButton>

				{/* Contenedor de notificaciones */}
				{showNotifications && (
					<NotificationsContainer>
						<Notifications />
					</NotificationsContainer>
				)}
			</nav>
		</StyledHeader>
	);
};

export default Header;

