import React, { useState } from 'react';
import { styled } from '@mui/system';
import Chat from './Chat';

// Contenedor flotante del chat
const FloatingContainer = styled('div')(({ theme }) => ({
	position: 'fixed',
	bottom: '20px',
	right: '20px',
	width: '300px',
	height: '400px',
	backgroundColor: theme.palette.primary.main,
	boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
	borderRadius: '10px',
	zIndex: 1000,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden', // Mantiene el contenido dentro del contenedor
}));

// Contenedor para los mensajes y el campo de texto
const ChatBody = styled('div')({
	overflowY: 'auto', // Para que los mensajes puedan desplazarse si son muchos
	display: 'flex',
	padding: '0px',
	boxSizing: 'border-box',
});

// Encabezado del chat
const Header = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.secondary.main,
	padding: '10px',
	color: theme.palette.common.white,
	fontWeight: 'bold',
	textAlign: 'center',
	position: 'relative', // Asegura que el botón de cierre esté en la esquina
}));

// Botón de cerrar
const CloseButton = styled('button')(({ theme }) => ({
	position: 'absolute',
	top: '10px',
	right: '10px',
	backgroundColor: '#ff4d4d',
	color: theme.palette.common.white,
	border: 'none',
	borderRadius: '50%',
	width: '25px',
	height: '25px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	cursor: 'pointer',
	zIndex: 1100,
	fontSize: '16px',
}));

// Botón para abrir el chat
const ToggleButton = styled('button')(({ theme }) => ({
	position: 'fixed',
	bottom: '20px',
	right: '20px',
	backgroundColor: theme.palette.primary.dark,
	color: theme.palette.common.white,
	borderRadius: '50%',
	width: '50px',
	height: '50px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	border: 'none',
	cursor: 'pointer',
	zIndex: 999,
	boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
	fontSize: '24px',
}));

const FloatingChat: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	// Alterna la visibilidad del chat
	const toggleChat = () => {
		setIsOpen(!isOpen);
	};

	// Obtiene el userId desde el localStorage (esto puede ser sustituido por contexto si usas un estado global)
	const userId = localStorage.getItem('userId');

	// Si no hay userId, muestra un mensaje indicando que el usuario necesita autenticarse
	if (!userId) {
		return <div>Necesitas estar autenticado para usar el chat.</div>;
	}

	return (
		<>
			{/* Botón flotante para abrir/cerrar el chat */}
			<ToggleButton onClick={toggleChat}>
				{isOpen ? '×' : '💬'}
			</ToggleButton>

			{/* Chat flotante solo visible si isOpen es true */}
			{isOpen && (
				<FloatingContainer>
					<Header>
						Chat
						{/* Botón de cierre dentro del encabezado */}
						<CloseButton onClick={toggleChat}>×</CloseButton>
					</Header>
					<ChatBody>
						{/* El componente Chat recibe el userId */}
						<Chat userId={userId} />
					</ChatBody>
				</FloatingContainer>
			)}
		</>
	);
};

export default FloatingChat;

