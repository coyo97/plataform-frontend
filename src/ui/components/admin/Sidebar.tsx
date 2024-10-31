import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar: React.FC = () => (
  <div className="sidebar">
    <h2>Admin Panel</h2>
    <nav>
      <ul>
        <li><Link to="/administrator">Dashboard</Link></li>
        <li><Link to="/administrator/users">Gestión de Usuarios</Link></li>
        <li><Link to="/administrator/roles">Gestión de Roles</Link></li>
        <li><Link to="/administrator/moderator">Moderador IA</Link></li>
        <li><Link to="/administrator/center-alert">Centro de alertas</Link></li>
        <li><Link to="/administrator/career">Carreras</Link></li>
        <li><Link to="/administrator/conf-file">Configuracion Archivos</Link></li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;

