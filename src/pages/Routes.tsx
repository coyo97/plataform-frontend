import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from '../ui/components/welcome/Welcome';
import FormLogin from '../ui/components/auth/loginForm/FormLogin';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<FormLogin />} />
      {/* Otras rutas */}
    </Routes>
  );
};

export default AppRoutes;

