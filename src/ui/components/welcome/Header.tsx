import React from 'react';
import { Link } from 'react-router-dom';
import { Header as StyledHeader } from './header.styles';

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <div>
        <nav>
          <ul>
            <li><Link to='/'>Inicio</Link></li>
            <li><Link to='/caracteristicas'>Características</Link></li>
            <li><Link to='/ayuda-academica'>Ayuda Académica</Link></li>
            <li><Link to='/contacto'>Contacto</Link></li>
            <li><Link to='/register' className="highlight">Registrarse</Link></li>
            <li><Link to='/login'>Iniciar Sesión</Link></li>
          </ul>
        </nav>
      </div>
    </StyledHeader>
  );
};

export default Header;

