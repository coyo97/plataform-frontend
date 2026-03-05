// ui/features/academicHelp/atoms/HelpHeader.tsx
import React from 'react';
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Link as MuiLink,
	Box,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link, useNavigate } from 'react-router-dom';

interface HelpHeaderProps {
	onToggleSidebar?: () => void;
}

const HelpHeader: React.FC<HelpHeaderProps> = ({ onToggleSidebar }) => {
	const navigate = useNavigate();

	return (
		<AppBar
			position="static"
			color="primary"
			sx={{
				mb: 2,
				boxShadow: 1,
			}}
		>
			<Toolbar
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					minHeight: (t) => t.mixins.toolbar.minHeight,
				}}
			>
				{/* Izquierda: botón atrás */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<IconButton color="inherit" onClick={() => navigate(-1)} size="small">
						<ArrowBack fontSize="small" />
					</IconButton>

					<Typography
						variant="subtitle2"
						sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.9 }}
					>
						Volver
					</Typography>
				</Box>

				{/* Centro: breadcrumb */}
				<Typography
					variant="body2"
					sx={{
						textAlign: 'center',
						flex: 1,
						mx: 2,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					<MuiLink
						component={Link}
						to="/academic-help"
						underline="hover"
						color="inherit"
						sx={{ fontWeight: 500 }}
					>
						Ayuda académica
					</MuiLink>
					{' / '}
					<span style={{ opacity: 0.85 }}>Ver solicitud</span>
				</Typography>

				{/* Derecha: filtros o link al listado */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{onToggleSidebar ? (
						<IconButton
							color="inherit"
							onClick={onToggleSidebar}
							size="small"
							sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
						>
							<FilterListIcon fontSize="small" />
						</IconButton>
					) : null}

					<MuiLink
						component={Link}
						to="/academic-help"
						color="inherit"
						underline="hover"
						sx={{ fontSize: '0.8rem', display: { xs: 'none', sm: 'inline' } }}
					>
						Ir al listado
					</MuiLink>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default HelpHeader;

