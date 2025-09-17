import {Button} from "@mui/material";
import React from "react";
import Sidebar3 from "../../../shared/organisms/sidebar/Sidebar3";
import {padding} from "@mui/system";
import SidebarNav from "../../../shared/organisms/sidebar/SidebarNav";

const Test6: React.FC = () => {
	const [open, setOpen] = React.useState(false);
	const [section, setSection] = React.useState('Home');

	return(
		<>
			<Button onClick={()=> setOpen(true)} sx={{m:2}}>Open</Button>
			<Sidebar3
				open={open}
				onClose={()=>setOpen(false)}
				width={280}
				variant="primary"
				sticky= {false}
				header={<div style={{fontWeight: 600, padding: 16}}>My App</div>}
				footer={<div style={{padding: 16}}>2025</div>}
			>
				<SidebarNav
					active={section}
					items={[
						{label:'Home', onClick: ()=>setSection('Home')},
						{label: 'Profile', onClick: () => setSection('Profile')},
						{label: 'Configuration', onClick:() => setSection('Configuration')}
					]}
				></SidebarNav>
			</Sidebar3>

			<div style={{ marginLeft: 300, padding: 16 }}>
				<h1>Contenido: {section}</h1>
				<p>Haz clic en una opción del menú para cambiar la sección.</p>
			</div>
		</>
	)
}

export default Test6;
