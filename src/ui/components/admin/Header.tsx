import React from 'react';
import { Button } from '@mui/material';

const Header: React.FC = () => (
  <header className="header">
    <h1>Administración del Sistema</h1>
    <Button variant="contained" color="secondary">Salir</Button>
  </header>
);

export default Header;

