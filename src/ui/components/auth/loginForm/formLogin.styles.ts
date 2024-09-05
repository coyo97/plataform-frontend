import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import mq from '../../../../config/mq';

// Añade el tipo de tema explícitamente en la función estilizada
const FormWrapper = styled('form')(({ theme }: { theme?: Theme }) => {
	if (!theme) {
		// Puedes definir un color de fondo predeterminado si `theme` es undefined
		return {
			backgroundColor: '#FFFFFF', // Color predeterminado en hexadecimal
			borderRadius: '4px', // Valor predeterminado
			boxShadow: '0 1px 3px rgba(0,0,0,0.12)', // Valor predeterminado
			padding: '20px',
			display: 'flex',
			flexDirection: 'column',
			gap: '16px',
			width: '100%',
		};
	}

	return {
		backgroundColor: hexToRgba(theme.palette.colorForm.main, 1), // Convertir color hexadecimal a rgba con opacidad al 100%
		borderRadius: theme.shape.borderRadius,
		boxShadow: theme.shadows[2],
		padding: '20px',
		display: 'flex',
		flexDirection: 'column',
		gap: '16px',
		[mq('xxs', 'max')]: {
			width: '100%',
		},
		[mq('md', 'min')]: {
			width: '400px',
		},
	};
});

const FormTitle = styled('h1')({
	fontSize: '24px',
	color: 'white',
	marginBottom: '16px',
});

const FormInput = styled('input')({
	padding: '10px',
	borderRadius: '4px',
	border: '1px solid #ddd',
	width: '100%',
});

const SubmitButton = styled('button')(({ theme }: { theme?: Theme }) => ({
	padding: '10px',
	borderRadius: '4px',
	border: 'none',
	backgroundColor: theme?.palette.colorButton.main,
	color: 'black',
	fontSize: '16px',
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: theme?.palette.colorButton.second,
	},
}));

const FormLabel = styled('label')(({ theme }: { theme?: Theme }) => ({
	color: 'white', // Usar el color primario de texto del tema
	fontSize: '16px',
	marginBottom: '8px',
}));

const hexToRgba = (hex: string, alpha: number = 1) => {
	// Elimina el '#' si está presente
	hex = hex.replace(/^#/, '');

	// Extrae los valores RGB
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	// Devuelve el valor RGBA
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


export { FormWrapper, FormTitle, FormInput, SubmitButton, FormLabel};

