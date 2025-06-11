import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { useHelpThread } from '../hook/useHelpThread';
import Loader from '../../../shared/atoms/feedback/loader/Loader';

import HelpHeader from '../atoms/HelpHeader';
import HelpLayout from '../templetes/HelpLayout';
import HelpThreadViewer from '../organisms/HelpThreadViewer';
import HelpFilterSidebar from '../organisms/HelpFilterSidebar';

const AcademicHelpDetailPage = () => {
	const { helpId } = useParams<{ helpId: string }>();
	const [sidebarOpen, setSidebarOpen] = useState(false); // control opcional

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

