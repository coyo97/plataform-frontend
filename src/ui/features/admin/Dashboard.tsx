import React from 'react';

const Dashboard: React.FC = () => (
	<div
		className="dashboard-container"
		style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			height: '100vh'
		}}
	>
		<h1>Bienvenido al Panel de Administración</h1>
		<p>Aquí puedes gestionar usuarios, revisar reportes y más.</p>
	</div>

);

export default Dashboard;

