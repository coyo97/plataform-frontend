// src/routes/RequirePerm.tsx
import React from 'react';
import ProtectedRoute from './ProtectedRoute';

type Props = {
	element: React.ReactElement;
	module: string;
	action?: string; 
};

const RequirePerm: React.FC<Props> = ({ element, module, action = 'read' }) => (
	<ProtectedRoute
		element={element}
		requiredModule={module}
		requiredAction={action}
	/>
);

export default RequirePerm;

