import Reat from 'react';
import Header from './Header';
import PostList from './post/PostList';
import CreatePublication from '../publications/CreatePublication';
import ViewPublications from '../publications/ViewPublications';

const Plataform: React.FC = () => {
	return(
		<>
			<CreatePublication/>
			<ViewPublications/>
		</>
    );
}
export default Plataform;
