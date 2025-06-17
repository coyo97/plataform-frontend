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

import MenuIcon from '@mui/icons-material/Menu';

import SmartBox          from '../../../shared/atoms/box/SmartBox';
import Sidebar           from '../../../shared/organisms/sidebar/Sidebar';
import SectionTitle      from '../../../shared/atoms/titles/SectionTitle';
import StreamCreateForm  from '../organisms/StreamCreateForm';
import StreamList        from '../organisms/StreamList';
import type { Stream }   from '../../../../types/stream';

import { styles }        from './homeStreamLayout.styles';

interface LayoutProps {
	children?: React.ReactNode;                 // <StreamActiveLayout/> cuando se está dentro
	onStreamCreated: (id: string, access?: string) => void;
	onStreamSelected: (s: Stream) => void;      // ① NUEVO
}

const HomeStreamLayout: React.FC<LayoutProps> = ({
	children,
	onStreamCreated,
	onStreamSelected,
}) => {
	const theme = useTheme();

	/* ─ Sidebar (mobile) ─ */
	const [openSidebar, setOpenSidebar] = useState(false);

	const hasChild = Array.isArray(children) ? children.some(Boolean) : Boolean(children);

	/* ─ Filtro de lista ─ */
	const [filter, setFilter] = useState<'live' | 'ended' | 'all'>('live');
	const handleFilterChange = (e: SelectChangeEvent) =>
		setFilter(e.target.value as 'live' | 'ended' | 'all');

	return (
		<>
			{/* Header superior */}
<Box sx={styles.headerBox(theme)}>
  <Box sx={styles.headerInner}>
    {/* Botón para abrir sidebar */}
    <Box
      component="button"
      onClick={() => setOpenSidebar(true)}
      sx={styles.menuButton(theme)}
    >
      <MenuIcon />
    </Box>

    <Box component="h2" sx={styles.headerTitle(theme)}>
      STREAM ACADÉMICO
    </Box>
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
				<Box sx={styles.contentBox(theme)}>
					{hasChild ? (
						/* Stream activo (StreamActiveLayout) */
						children
					) : (
					/* Lista + filtro */
					<>
						<FormControl size="small" sx={styles.formControl(theme)}>
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

