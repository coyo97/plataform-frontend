// Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header as StyledHeader, ToggleButton, ArrowIcon } from './header.styles';

const Header: React.FC = () => {
	const [isHidden, setIsHidden] = useState(false);

	const toggleHeader = () => {
		setIsHidden(!isHidden);
	};

	return (
		<>
			<StyledHeader className={isHidden ? 'hidden' : ''}>
				<div>
					<nav>
						<ul>
							<li><Link to='/' className="highlight">Administrador</Link></li>
							<li><Link to='/profile'>Estudiante</Link></li>
							<li><Link to='/material-user'>Material</Link></li>
							<li><Link to='/contacto'>Mensajería</Link></li>
							<li><Link to='/register'>Ayuda Académica</Link></li>
							<li><Link to='/publications'>Home</Link></li>
						</ul>
					</nav>
				</div>
			</StyledHeader>
			<ToggleButton onClick={toggleHeader}>
				<ArrowIcon isHidden={isHidden} />
			</ToggleButton>
		</>
	);
};

export default Header;

