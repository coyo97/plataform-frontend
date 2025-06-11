// types
export interface MessageComposerProps {
	onSend: (txt:string)=>void;
	onSendFile: (file:File, txt?:string)=>void;
}

