// src/async/services/careerService.ts
import { get, post, put, del } from '../api';
import getEnvVariables from '../../config/configEnvs';
import * as R     from '../routes/facultyCareerRoutes';
import type { Career } from '../../types/publication'; // o types/career.ts si lo separas

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

export const list = async (): Promise<Career[]> => {
	const { careers } = await get<{ careers: Career[] }>(url(R.CAREERS), {});
	return careers;
};
/* ---------- Facultades ---------- */
export const fetchFaculties = async () => {
	const { faculties } = await get<{faculties:any[]}>(url(R.FACULTIES));
	return faculties;
};/* ---------- Carreras ------------- */
export const fetchCareers = async () => {
	const { careers } = await get<{careers:any[]}>(url(R.CAREERS));
	return careers;
};

export const createCareer = async (payload:{
	name:string; description?:string; facultyId?:string;
}) => post(url(R.CAREERS), payload);

export const updateCareer = async (id:string, payload:{
	name:string; description?:string; facultyId?:string;
}) => put(url(R.CAREER_BY_ID(id)), payload);

export const deleteCareer = async (id:string) =>
	del(url(R.CAREER_BY_ID(id)));

export const createFaculty = async (payload:{ name:string; dean?:string; icon?:string }) =>
  post(url(R.FACULTIES), payload);

export const updateFaculty = async (id:string, payload:{ name:string; dean?:string; icon?:string }) =>
  put(url(R.FACULTY_BY_ID(id)), payload);

export const deleteFaculty = async (id:string) =>
  del(url(R.FACULTY_BY_ID(id)));
