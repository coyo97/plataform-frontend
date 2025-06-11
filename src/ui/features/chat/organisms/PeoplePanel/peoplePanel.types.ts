// peoplePanel.types.ts
export interface PanelUser   { _id:string; username:string }
export interface PanelGroup  { _id:string; name:string }

export interface PeoplePanelProps {
	users           : PanelUser[];
	groups          : PanelGroup[];
	activeId        : string;
	onSelectUser    : (id:string)=>void;
	onSelectGroup   : (id:string)=>void;
	/** modo “chat flotante” */
	floating?       : boolean;
}

