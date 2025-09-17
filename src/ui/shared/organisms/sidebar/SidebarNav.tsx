import React from "react";
import {List, ListItemButton, ListItemText} from "@mui/material";


const SidebarNav: React.FC<{items: {label: string; onClick?: () => void}[];
	active?: string;
}> = ({items, active}) => {
	return (
		<List>
			{items.map((item)=>(
				<ListItemButton
					key={item.label}
					selected={active===item.label}
					onClick={item.onClick}
				>
					<ListItemText primary={item.label}/>
				</ListItemButton>
			))}
		</List>
	)
}

export default SidebarNav;
