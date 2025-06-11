import React from 'react';
import { useParams } from 'react-router-dom';
import HelpThreadViewer from '../organisms/HelpThreadViewer';
import HelpLayout from '../templetes/HelpLayout';

const ViewHelpPage: React.FC = () => {
	const { helpId } = useParams<{ helpId: string }>();
	if (!helpId) return null;

	return (
		<HelpLayout>
			<HelpThreadViewer helpId={helpId} />
		</HelpLayout>
	);
};
export default ViewHelpPage;

