import React, { useState } from 'react';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import StreamCreateForm from '../organisms/StreamCreateForm';
import StreamList from '../organisms/StreamList';
import type { Stream } from '../../../../types/stream';
import { styles } from './homeStreamLayout.styles';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import GridColumn from '../../../shared/atoms/grid/GridColumn';
import IconButton from '../../../shared/atoms/buttons/iconButton/IconButton';
import Sidebar from '../../../shared/organisms/sidebar/Sidebar';
import Header from '../../../shared/organisms/header/Header';
import { NavLink, navLinks } from '../../../../config/navLinks';
import Logo from '../../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';
import SearchOverlay from '../../../shared/organisms/SearchOverlay/SearchOverlay';
interface LayoutProps {
	children?: React.ReactNode;
	onStreamCreated: (id: string, access?: string) => void;
	onStreamSelected: (s: Stream) => void;
}
const HomeStreamLayout: React.FC<LayoutProps> = ({
	children,
	onStreamCreated,
	onStreamSelected,
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [openSidebar, setOpenSidebar] = useState(false);
	const hasChild = Array.isArray(children)
		? children.some(Boolean)
		: Boolean(children);
		const [filter, setFilter] = useState<'live' | 'ended' | 'all'>('live');
		const handleFilterChange = (e: SelectChangeEvent) =>
			setFilter(e.target.value as 'live' | 'ended' | 'all');
		return (
			<>
							<Header
				logoSrc={Logo}
				variant="gradient"
				navLinks={navLinks}
				userRole="student"
				onLogout={() => console.log('Logout')}
				onNotificationsClick={() => console.log('Abrir notificaciones')}
				onAvatarClick={() => console.log('Abrir menú usuario')}
				SearchComponent={
					<SearchOverlay
						onSearch={(q, cat) =>
							console.log(`Buscar "${q}" en categoría "${cat}"`)
						}
					/>
				}
			/>
				{/* Botón hamburguesa (solo mobile) */}
				{isMobile && (
					<IconButton
						ariaLabel="Abrir menú"
						onClick={() => setOpenSidebar(true)}
						sx={styles.menuButton(theme)}
					>
						<MenuIcon />
					</IconButton>
				)}
				<GridContainer variant="desktopFixed" 		style={{ paddingTop: 'calc(var(--header-h) + 4px)' }}
				columns={{ xs: 4, sm: 6, md: 12 }}  >
					{isMobile ? (
						<GridColumn span={12}>
							<Sidebar
								open={openSidebar}
								onClose={() => setOpenSidebar(false)}
								width={320}
								variant="flat"
								position="left"
								header={<SectionTitle>Crear nuevo stream</SectionTitle>}
							>
								<StreamCreateForm onStreamCreated={onStreamCreated} />
							</Sidebar>
						</GridColumn>
					) : (
						<GridColumn span={3}>
							<Sidebar
								open
								width={320}
								variant="flat"
								sticky
								position="left"
								header={<SectionTitle>Crear nuevo stream</SectionTitle>}
							>
								<StreamCreateForm onStreamCreated={onStreamCreated} />
							</Sidebar>
						</GridColumn>
					)}
					{/* 2️⃣ Zona central */}
					<GridColumn span={isMobile ? 12 : 9}>
						{hasChild ? (
							children
						) : (
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
								<StreamList
									key={filter}
									type={filter}
									onSelect={onStreamSelected}
								/>
							</>
						)}
					</GridColumn>
				</GridContainer>
			</>
		);
};
export default HomeStreamLayout;
