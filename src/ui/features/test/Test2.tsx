
import React from 'react';
import { Button } from '@mui/material';
import Sidebar2 from '../../shared/organisms/sidebar/Sidebar2';
import {relative} from 'path';

const Test2: React.FC = ()=>{
	const [pos, setPos] = React.useState<'left' | 'right'>('left');
	const [sticky, setSticky] = React.useState(false);
	
	return(
		<>
			<div style={{padding:16, position:'relative', zIndex: 100,}}>
				<Button onClick={()=> setPos(p => p === 'left' ? 'right' : 'left')}>
					position: {pos}
				</Button>
				<Button onClick={()=> setSticky(s => !s)}>
					sticky: {String(sticky)}
				</Button>
			</div>
			<Sidebar2 width={280} position={pos} sticky={sticky} variant='surface'>
				Position: {pos} - Sticky: {String(sticky)}
			</Sidebar2>

			<div style={{padding:16, ...(pos === 'left' ? {marginLeft: 300}:{marginRight: 300})}}>
				<h1>Content</h1>
				<p>Altern `left/right`.  </p>
			</div>
		</>
	)
}

export default Test2;
