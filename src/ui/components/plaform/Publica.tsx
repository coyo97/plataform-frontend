import Reat from 'react';
import Header from './Header';
import PostList from './post/PostList';
import CreatePublication from '../publications/CreatePublication';
import ViewPublications from '../publications/ViewPublications';
import UpdateProfile from '../profile/UpdateProfile';
import ViewProfile from '../profile/ViewProfile';
import ViewUserPublications from '../publications/user/UserMaterials';
import CareerManager from '../careers/CareerManager';
//<CreatePublication/>
	//		<UpdateProfile/>
		//	<ViewProfile/>

const Plataform: React.FC = () => {
	return(
		<>
			<Header/>
			<div>

			<CareerManager/>
			</div>
		</>
	);
}
export default Plataform;
