// chatSidebar.types.ts
export interface ChatSidebarProps {
	users : { _id:string; username:string; profile?:{profilePicture?:string} }[];
	groups: { _id:string; name:string }[];
	activeId    ?: string;
	onSelectUser : (id:string)=>void;
	onSelectGroup: (id:string)=>void;
}

