import React from "react";
import { Button } from "@mui/material";
import Sidebar2 from "../../shared/organisms/sidebar/Sidebar2";

const Test4: React.FC = () => {

	const [open, setOpen] = React.useState(false);

	return (
		<>
			<Button onClick={() => setOpen(true)} sx={{m:2}}>
				Abrir
			</Button>
			<Sidebar2 
				open={open}
				onClose={() => setOpen(false)}
				width={280}
				variant="surface"
				header={<div style={{fontWeight: 600}}>Header</div>}
				footer={<div>Footer</div>}
			>
				Haz clic fuera o presiona Esc para cerrar.
			</Sidebar2>

			<div style={{ marginLeft: 300, padding: 16 }}>
				<h1>Contenido</h1>
			</div>
		</>
	)
}

export default Test4;
