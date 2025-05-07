import Reat from 'react';

import ViewPublications from "./ViewPublications"
import ViewPublicationsPage from './pages/publications/ViewPublications.page';
import CreatePublication from './CreatePublication';

const HomePublications: React.FC = () => {
	return(
		<>
			{//<CreatePublication/>
			}
			<ViewPublicationsPage/>
		</>
    );
}
export default HomePublications;
