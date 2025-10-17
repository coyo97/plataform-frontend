import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Theme from './Theme/Theme';
import NavMenu from './ui/features/navMenu/NavMenu';
import { QueryClient, QueryClientProvider } from 'react-query';
import Welcome from './ui/features/welcome/Welcome';
import FormLogin from './ui/features/auth/loginForm/FormLogin';
import Canvas from './ui/features/canvas/Canvas';
import UserForm from './ui/features/auth/regiterForm/UserForm';
import Plataform from './ui/features/plaform/Publica';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePublications from './ui/features/publications/HomePublications';
import Home from './ui/features/plaform/Home';
import UserMaterials from './ui/features/publications/user/UserMaterials';

import Chat from './ui/features/chat/Chat';
import CareerManager from './ui/features/careers/CareerManager';
import HomeChat from './ui/features/chat/HomeChat';
import UserManagement from './ui/features/admin/UserManagement';
import Dashboard from './ui/features/admin/Dashboard';
import HomeRoles from './ui/features/roles/HomeRoles';
import HomeModerator from './ui/features/moderator/HomeModerator';
import HomeAlert from './ui/features/centerAlert/HomeAlert';
import HomeSetting from './ui/features/configFile/HomeSetting';
import ForgotPassword from './ui/features/auth/ForgotPassword';
import ResetPassword from './ui/features/auth/ResetPassword';
import AdminRoute from './routes/AdminRoute';
import HomeStreamPage from './ui/features/stream/pages/HomeStream.page';
import { SocketProvider } from './ui/providers/SocketProvider';
import HomeProfilePage from './ui/features/profile/HomeProfile.page';
import PublicationDetail from './ui/features/publications/pages/publications/PublicationDetail';
import AcademicHelpDetailPage from './ui/features/academicHelp/pages/AcademicHelpDetail.page';
import HomeAcademicHelp from './ui/features/academicHelp/HomeAcademicHelp.page';
import Test from './ui/features/test/Test';
import HomeTest from './ui/features/test/HomeTest';
import HomeOverlay from './ui/shared/organisms/SearchOverlay/HomeOverlay';
import AdminSidebarMenu from './ui/features/admin/AdminSidebarMenu';
import AuthorProfile from './ui/features/profile/AuthorProfile';
import { useMediaQuery, useTheme } from '@mui/material';

function App() {
	const queryClient = new QueryClient();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) {
				setIsSidebarOpen(true);
			} else {
				setIsSidebarOpen(false);
			}
		};
		// Establecer el estado inicial
		handleResize();

		// Escuchar cambios en el tamaño de la ventana
		window.addEventListener('resize', handleResize);

		// Limpiar el listener al desmontar el componente
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	  const theme = useTheme();
const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // md ≈ 900px

	return (
		<Theme>
			<QueryClientProvider client={queryClient}>
				<SocketProvider>
					<Router>
						<Routes>
							<Route path="/" element={<Welcome />} />
							<Route path="/login" element={<FormLogin />} />
							<Route path="/register" element={<UserForm />} />
							<Route path="/forgot-password" element={<ForgotPassword />} />
							<Route path="/reset-password/:token" element={<ResetPassword />} />

							<Route path="/plataform" element={<ProtectedRoute element={<Plataform />} />} />
							<Route path="/stream-academi" element={<ProtectedRoute element={<HomeStreamPage />} />} />
							<Route path="/academic-help" element={<ProtectedRoute element={<HomeAcademicHelp />} />} />
							<Route path="/academic-help/:helpId" element={<ProtectedRoute element={<AcademicHelpDetailPage />} />} />
							<Route path="/test" element={<HomeTest/>}/>

							<Route path="/publications" element={<ProtectedRoute element={<HomePublications />} />} />
							<Route path="/publications/:publicationId" element={<ProtectedRoute element={<PublicationDetail />} />} />

							<Route path="/profile/:id" element={<ProtectedRoute element={<AuthorProfile />} />} />
							<Route path="/profile" element={<ProtectedRoute element={<HomeProfilePage />} />} />

							<Route path="/material-user" element={<ProtectedRoute element={<UserMaterials />} />} />
							<Route path="/message" element={<ProtectedRoute element={<HomeChat />} />} />
							<Route path="/plataform/search" element={<HomeOverlay/>} />

							<Route
								path="/administrator/*"
								element={
									<AdminRoute
										element={
											<div
												style={{
													display: 'grid',
													 gridTemplateColumns: isDesktop ? '230px 1fr' : '1fr',
													minHeight: '100vh',
													paddingTop: 'var(--header-h)',   
													boxSizing: 'border-box',
													  overflowX: 'clip',
												}}
											>
												{/* Sidebar: sticky en desktop, modal en móvil */}
												<AdminSidebarMenu open onClose={undefined} />

												<div >
													<Routes>
														<Route path="/" element={<Dashboard />} />
														<Route path="users" element={<UserManagement />} />
														<Route path="roles" element={<HomeRoles />} />
														<Route path="moderator" element={<HomeModerator />} />
														<Route path="center-alert" element={<HomeAlert />} />
														<Route path="career" element={<CareerManager />} />
														<Route path="conf-file" element={<HomeSetting />} />
													</Routes>
												</div>
											</div>
										}
									/>
								}
							/>

						</Routes>

					</Router>
				</SocketProvider>
			</QueryClientProvider>
		</Theme>
	);
}

export default App;

