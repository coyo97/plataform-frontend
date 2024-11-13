import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Theme from './Theme/Theme';
import NavMenu from './ui/components/navMenu/NavMenu';
import { QueryClient, QueryClientProvider } from 'react-query';
import Welcome from './ui/components/welcome/Welcome';
import FormLogin from './ui/components/auth/loginForm/FormLogin';
import Canvas from './ui/components/canvas/Canvas';
import UserForm from './ui/components/auth/regiterForm/UserForm';
import Plataform from './ui/components/plaform/Publica';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePublications from './ui/components/publications/HomePublications';
import HomeProfile from './ui/components/profile/HomeProfile';
import Home from './ui/components/plaform/Home';
import UserMaterials from './ui/components/publications/user/UserMaterials';
import CreatePublication from './ui/components/publications/CreatePublication';

import AuthorProfile from './ui/components/profile/AuthorProfile';
import ViewProfile from './ui/components/profile/ViewProfile';
import UpdateProfile from './ui/components/profile/UpdateProfile';
import Chat from './ui/components/chat/Chat';
import CareerManager from './ui/components/careers/CareerManager';
import HomeChat from './ui/components/chat/HomeChat';
import UserManagement from './ui/components/admin/UserManagement';
import Dashboard from './ui/components/admin/Dashboard';
import HomeRoles from './ui/components/roles/HomeRoles';
import Sidebar from './ui/components/admin/Sidebar';
import HomeModerator from './ui/components/moderator/HomeModerator';
import HomeAlert from './ui/components/centerAlert/HomeAlert';
import HomeSetting from './ui/components/configFile/HomeSetting';
import HomeStream from './ui/components/stream/HomeStream';
import PublicationDetail from './ui/components/publications/PublicationDetail';
import './ui/components/admin/adminLayout.css'; // Asegúrate de que la ruta sea correcta
import ForgotPassword from './ui/components/auth/ForgotPassword';
import ResetPassword from './ui/components/auth/ResetPassword';
import AdminRoute from './routes/AdminRoute';

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


	return (
		<Theme>
			<QueryClientProvider client={queryClient}>
				<Router>
					<Routes>
						<Route path="/" element={<Welcome />} />
						<Route path="/login" element={<FormLogin />} />
						<Route path="/register" element={<UserForm/>} />
						<Route path='/plataform' element={<ProtectedRoute element={<Plataform />} />}></Route>
						<Route path='/stream-academi' element={<HomeStream/>}></Route>
						<Route path='/publications' element={<HomePublications/>}></Route>
						<Route path="/publications/:publicationId" element={<PublicationDetail />} />
						<Route path='/profile' element={<HomeProfile/>}></Route>
						<Route path='/material-user' element={<UserMaterials/>}></Route>
						<Route path="/profile/:id" element={<AuthorProfile />} />
						<Route path="/profile" element={<ViewProfile />} />
						<Route path="/profile/update" element={<UpdateProfile />} />
						<Route path='/message' element={<HomeChat/>}></Route>
						<Route path="/forgot-password" element={<ForgotPassword/>} />
						<Route path="/reset-password/:token" element={<ResetPassword/>} />
						{/* Rutas del Dashboard con Sidebar */}
						<Route
							path="/administrator/*"
							element={
								<AdminRoute
									element={
										<div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
											<Sidebar isVisible={isSidebarOpen} />
											<div className="admin-content">
												{/* Botón de menú para pantallas pequeñas */}
												<button
													className="menu-button"
													onClick={() => setIsSidebarOpen(!isSidebarOpen)}
												>
													☰
												</button>
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
			</QueryClientProvider>
		</Theme>
	);
}

export default App;

