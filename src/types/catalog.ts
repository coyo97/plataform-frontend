export interface Faculty {
	_id: string;
	name: string;
	icon?: string;
	dean?: string;
}

export interface Career {
	_id: string;
	name: string;
	description?: string;
	facultyId?: string;
}

export interface Subject {
	_id: string;
	name: string;
	code?: string;
	careerIds?: string[];
	level?: number;
}

export interface Cycle {
	_id: string;
	year: number;
	number?: number;
	type: 'semester' | 'trimester' | 'year';
}

export interface Unit {
	_id: string;
	subjectId: string;
	title: string;
	week?: number;
}

