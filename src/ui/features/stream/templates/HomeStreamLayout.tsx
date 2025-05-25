// src/ui/features/stream/templates/HomeStreamLayout.tsx
import React, { useState } from 'react';
import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	useTheme,
} from '@mui/material';
import SmartBox       from '../../../shared/atoms/box/SmartBox';
import Sidebar        from '../../../shared/organisms/sidebar/Sidebar';
import SectionTitle   from '../../../shared/atoms/titles/SectionTitle';
import StreamCreateForm from '../organisms/StreamCreateForm';
import StreamList       from '../organisms/StreamList';
import type { Stream }  from '../../../../types/stream';

interface LayoutProps {
	children?: React.ReactNode;                 // <StreamActiveLayout/> cuando se está dentro
	onStreamCreated: (id: string, access?: string) => void;
	onStreamSelected: (s: Stream) => void;          // ① NUEVO
}

const HomeStreamLayout: React.FC<LayoutProps> = ({
	children,
	onStreamCreated,
	onStreamSelected
}) => {
	const theme = useTheme();

	/* ─ Sidebar (mobile) ─ */
	const [openSidebar, setOpenSidebar] = useState(true);

	const hasChild = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
	/* ─ Filtro de lista ─ */
	const [filter, setFilter] = useState<'live' | 'ended' | 'all'>('live');
	const handleFilterChange = (e: SelectChangeEvent) =>
		setFilter(e.target.value as 'live' | 'ended' | 'all');

	return (
		<>
			{/* Header superior */}
			<Box
				sx={{
					width: '100%',
					bgcolor: theme.customColors.uatf.red,
					py: theme.padding.px6,
					px: theme.padding.px10,
					boxShadow: theme.shadows[10],
				}}
			>
				<Box
					component="h2"
					sx={{
						fontFamily: `'Allerta Stencil', serif`,
						color: theme.customColors.neutral.white[900],
						fontSize: theme.typographyTokens.display.lg.monospace,
					}}
				>
					STREAM ACADÉMICO
				</Box>
			</Box>

			{/* Contenedor general */}
			<SmartBox row>
				{/* 1️⃣ Sidebar */}
				<Sidebar
					open={openSidebar}
					onClose={() => setOpenSidebar(false)}
					width={320}
					variant="flat"
					sticky
					position="left"
					header={<SectionTitle>Crear nuevo stream</SectionTitle>}
				>
					<StreamCreateForm onStreamCreated={onStreamCreated} />
				</Sidebar>

				{/* 2️⃣ Zona central */}
				<Box sx={{ flex: 1, px: theme.padding.px10, py: theme.padding.px6 }}>
					{hasChild ? (
						/* Stream activo (StreamActiveLayout) */
						children
					) : (
					/* Lista + filtro */
					<>
						<FormControl size="small" sx={{ minWidth: 160, mb: theme.padding.px6 }}>
							<InputLabel id="stream-filter-label">Mostrar</InputLabel>
							<Select
								labelId="stream-filter-label"
								label="Mostrar"
								value={filter}
								onChange={handleFilterChange}
							>
								<MenuItem value="live">En directo</MenuItem>
								<MenuItem value="ended">Finalizados</MenuItem>
								<MenuItem value="all">Todos</MenuItem>
							</Select>
						</FormControl>

						<StreamList key={filter} type={filter} onSelect={onStreamSelected} />
					</>
					)}
				</Box>
			</SmartBox>
		</>
	);
};

export default HomeStreamLayout;

