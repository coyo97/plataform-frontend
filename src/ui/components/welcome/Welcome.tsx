import React from 'react';
import Header from './Header';
import Canvas from '../canvas/Canvas';
import { Box } from '@mui/material';
import Escudo_Universidad_Autónoma_Tomás_Frías from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';

const Welcome: React.FC = () => {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#f0f0f0', // color de fondo opcional
				position: 'relative',
			}}
		>
			{/* Imagen centrada y ajustada en tamaño */}
			<Box
				component="img"
				src={Escudo_Universidad_Autónoma_Tomás_Frías}
				alt="Logo Universidad"
				sx={{
					width: '150px', // Ajusta el tamaño aquí
					height: 'auto',
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: 0.2, // Ajuste de opacidad para no interferir visualmente
				}}
			/>

			{/* Menú y contenido */}
			<Header />
			<Canvas />
		</Box>
	);
};

export default Welcome;

