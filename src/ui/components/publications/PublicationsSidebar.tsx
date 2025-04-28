// ─────────────────────────────────────────────────────────────
// src/ui/components/publications/PublicationsSidebar.tsx
// contenedor del formulario  «Crear publicación»  y futuros widgets
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Box }           from '@mui/material';
import CreatePublication from './CreatePublication';

interface Props {
  /** callback que añade la nueva publicación al feed */
  handleNewPublication: (p: any) => void;
}

const PublicationsSidebar: React.FC<Props> = ({ handleNewPublication }) => (
  <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
    {/* ① — formulario de alta */}
    <CreatePublication onPublicationCreated={handleNewPublication}/>
    {/* ② — aquí puedes ir añadiendo widgets (tendencias, banners, etc.) */}
  </Box>
);

export default PublicationsSidebar;

