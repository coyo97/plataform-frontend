// ui/features/academicHelp/pages/AcademicHelpDetail.page.tsx
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import HelpHeader from '../atoms/HelpHeader';
import HelpLayout from '../templetes/HelpLayout';
import HelpThreadViewer from '../organisms/HelpThreadViewer';

const AcademicHelpDetailPage: React.FC = () => {
	const { helpId } = useParams<{ helpId: string }>();
	const [sidebarOpen, setSidebarOpen] = useState(false); // lo dejas por si luego quieres reusar

	// Si no hay ID, redirigir al listado
	if (!helpId) return <Navigate to="/academic-help" replace />;

	return (
		<>
			<HelpHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
			<HelpLayout>
				<HelpThreadViewer helpId={helpId} />
			</HelpLayout>
		</>
	);
};

export default AcademicHelpDetailPage;

