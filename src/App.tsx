import React from 'react';
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

function App() {
	const queryClient = new QueryClient();
	 // Ejemplo: Obtener userId del localStorage o contexto

	 	const userId = '12345'; // Obtén el userId de la fuente correcta, como estado o props
	const streamId = 'stream123'; // También lo puedes obtener dinámicamente

	return (
		<Theme>
			<QueryClientProvider client={queryClient}>
				<Router>
					<Routes>
						<Route path="/" element={<Welcome />} />
						<Route path="/login" element={<FormLogin />} />
						<Route path='/plataform' element={<ProtectedRoute element={<Plataform />} />}></Route>
						<Route path='/stream-academi' element={<HomeStream/>}></Route>
						<Route path='/publications' element={<HomePublications/>}></Route>
						<Route path='/profile' element={<HomeProfile/>}></Route>
						<Route path='/publications' element={<Home/>}></Route>
						<Route path='/material-user' element={<UserMaterials/>}></Route>
						<Route path="/profile/:id" element={<AuthorProfile />} />
						<Route path="/profile" element={<ViewProfile />} />
						<Route path="/profile/update" element={<UpdateProfile />} />
						{/*					<Route path='/administrator' element={<CareerManager/>}></Route> */}
						<Route path='/message' element={<HomeChat/>}></Route>
						{
					//Administrator
						}
						            {/* Rutas del Dashboard con Sidebar */}
            <Route
              path="/administrator/*"
              element={
                <div className="admin-layout">
                  <Sidebar /> {/* Sidebar siempre visible en rutas del Dashboard */}
                  <div className="admin-content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="roles" element={<HomeRoles/>} />
                      <Route path="moderator" element={<HomeModerator/>} />
                      <Route path="center-alert" element={<HomeAlert/>} />
                      <Route path="career" element={<CareerManager/>} />
                      <Route path="conf-file" element={<HomeSetting/>} />
                    </Routes>
                  </div>
                </div>
              }
            />
					</Routes>
					{//<Notifications/>
					}
				</Router>
			</QueryClientProvider>
		</Theme>
	);
}

export default App;

