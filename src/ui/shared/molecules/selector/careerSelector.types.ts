export interface Career {
	_id  : string;
	name: string;
}

export interface CareerSelectorProps {
	careers     : Career[];
	value?      : string;                    // career id seleccionado
	onChange    : (id: string) => void;
	label?      : string;
	placeholder?: string;
	error?      : boolean;
	helperText? : string;
	disabled?   : boolean;
	required?   : boolean;
	variant?: 'default' | 'transparent' | 'filled';
	dropdownMode?  : 'overlay' | 'inline';   // ← nuevo (default: overlay)
}

