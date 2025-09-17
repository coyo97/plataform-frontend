import React from "react";
import Sidebar2 from "../../shared/organisms/sidebar/Sidebar2";
import { Button } from "@mui/material";

const Test: React.FC= () => {

	const [variant, setVariant] = React.useState<'default' | 'primary' | 'surface' | 'elevated' | 'flat'>('default')


	return(
		<>
			<div style={{padding: 16}}>
				<Button onClick={()=> setVariant('default')}>default</Button>
				<Button onClick={()=> setVariant('primary')}>primary</Button>
				<Button onClick={()=> setVariant('surface')}>surface</Button>
				<Button onClick={()=> setVariant('elevated')}>elevated</Button>
				<Button onClick={()=> setVariant('flat')}>flat</Button>
			</div>
			<Sidebar2
				width={280}
				variant={variant}
			>
				Hello from step two: Variant actually
			</Sidebar2>
			<div style={{marginLeft: 300, padding: 16}}>
				<h1>Contend</h1>
				<p > you should see the sidebar fixed on the left with a width of 280px </p>
			</div>
		</>
	)
}

export default Test;

