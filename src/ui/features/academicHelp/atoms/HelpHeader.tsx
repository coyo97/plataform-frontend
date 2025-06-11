import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Link as MuiLink } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList'; // Icono de filtro
import { Link, useNavigate } from 'react-router-dom';

interface HelpHeaderProps {
	onToggleSidebar?: () => void;
}

const HelpHeader: React.FC<HelpHeaderProps> = ({ onToggleSidebar }) => {
	const navigate = useNavigate();

	return (
		<AppBar position="static" color="primary" sx={{ mb: 2 }}>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<IconButton color="inherit" onClick={() => navigate(-1)}>
					<ArrowBack />
				</IconButton>

				<Typography variant="body2" sx={{ ml: 1 }}>
					<MuiLink component={Link} to="/academic-help" underline="hover" color="inherit">
						Ayuda académica
					</MuiLink>
					{' / '}Ver hilo
				</Typography>

				{/* Botón opcional de filtros */}
				{onToggleSidebar ? (
					<IconButton color="inherit" onClick={onToggleSidebar}>
						<FilterListIcon />
					</IconButton>
				) : (
					<MuiLink component={Link} to="/academic-help" color="inherit" underline="hover">
						Retornar al listado
					</MuiLink>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default HelpHeader;

