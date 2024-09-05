import React from 'react';
import Header from './Header';
import Canvas from '../canvas/Canvas';
import NavMenu from '../navMenu/NavMenu';

const Welcome: React.FC = () => {
	return (
		<div>
			<Header/>
			<NavMenu/>
			<Canvas/>
		</div>
	)
}

export default Welcome;
