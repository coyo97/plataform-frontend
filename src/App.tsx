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
import Notifications from './ui/components/notifications/Notifications';
import Chat from './ui/components/chat/Chat';
import CareerManager from './ui/components/careers/CareerManager';

function App() {
	const queryClient = new QueryClient();
	 // Ejemplo: Obtener userId del localStorage o contexto

	return (
		<Theme>
			<QueryClientProvider client={queryClient}>
				<Router>
					<Routes>
						<Route path="/" element={<Welcome />} />
						<Route path="/login" element={<FormLogin />} />
						<Route path='/plataform' element={<ProtectedRoute element={<Plataform />} />}></Route>
						<Route path='/register' element={<UserForm/>}></Route>
						<Route path='/publications' element={<HomePublications/>}></Route>
						<Route path='/profile' element={<HomeProfile/>}></Route>
						<Route path='/publications' element={<Home/>}></Route>
						<Route path='/material-user' element={<UserMaterials/>}></Route>
						<Route path="/profile/:id" element={<AuthorProfile />} />
						<Route path="/profile" element={<ViewProfile />} />
						<Route path="/profile/update" element={<UpdateProfile />} />
						<Route path='/administrator' element={<CareerManager/>}></Route>
					</Routes>
					{//<Notifications/>
					}
				</Router>
			</QueryClientProvider>
		</Theme>
	);
}

export default App;

