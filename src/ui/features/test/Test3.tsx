import React from "react";
import { Button } from "@mui/material";
import Sidebar2 from "../../shared/organisms/sidebar/Sidebar2";

const Test3: React.FC = () => {

	const [open, setOpen] = React.useState(true);

	return(
		<>
			<div style={{padding: 16, marginLeft: 300}}>
				<Button onClick={()=>setOpen(o=> !o)}>
					{open? 'close' : 'open'} Sidebar
				</Button>
			</div>

			<Sidebar2
				open={open}
				width={280}
				variant="surface"
				header={<div style={{fontWeight:600}}>My header</div>}
				footer={<div>© 2025</div>}
			>
				Content Scrollable
			</Sidebar2>

			<div style={{ marginLeft: 300, padding: 16 }}>
				<h1>Contenido</h1>
				<p>Prueba abrir/cerrar con el botón.</p>
			</div>
		</>
	)
}

export default Test3;
