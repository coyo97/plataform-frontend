import Reat from 'react';

import ViewPublications from "./ViewPublications"
import CreatePublication from './CreatePublication';

const HomePublications: React.FC = () => {
	return(
		<>
			<CreatePublication/>
			<ViewPublications/>
		</>
    );
}
export default HomePublications;
