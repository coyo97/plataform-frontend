import { get } from '../api';
import * as R  from '../routes/academicHelpRoutes';
import getEnv  from '../../config/configEnvs';
const { HOST,SERVICE } = getEnv();
const url = (p:string)=>`${HOST}${SERVICE}${p}`;

export const fetchFaculties = ()=> get<{faculties:any[]}>(url(R.FACULTIES));
export const fetchCareers   = (facultyId:string)=>
	get<{careers:any[]}>(url(R.CAREERS), { facultyId });
export const fetchSubjects  = (careerId:string)=>
	get<{subjects:any[]}>(url(R.SUBJECTS), { careerId });
export const fetchCycles    = ()=> get<{cycles:any[]}>(url(R.CYCLES));
export const fetchUnits     = (subjectId:string)=>
	get<{units:any[]}>(url(R.UNITS), { subjectId });

