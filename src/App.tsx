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

function App() {
	const queryClient = new QueryClient();

	return (
		<Theme>
			<QueryClientProvider client={queryClient}>
				<Router>
					<Routes>
						<Route path="/" element={<Welcome />} />
						<Route path="/login" element={<FormLogin />} />
						<Route path='/plataform' element={<ProtectedRoute element={<Plataform />} />}></Route>
						<Route path='/register' element={<UserForm/>}></Route>
					</Routes>
				</Router>
			</QueryClientProvider>
		</Theme>
	);
}

export default App;

