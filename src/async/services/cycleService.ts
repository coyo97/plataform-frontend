// async/services/cycleService.ts
import { get, post, put, del } from '../api';
import getEnv from '../../config/configEnvs';
const { HOST,SERVICE } = getEnv(); const url=(p:string)=>`${HOST}${SERVICE}${p}`;

export const listCycles   = ()=>get <{cycles:any[]}>(url('/cycles'));
export const createCycle  = (payload:any)=>post(url('/cycles'),payload);
export const updateCycle  = (id:string,p:any)=>put(url(`/cycles/${id}`),p);
export const deleteCycle  = (id:string)=>del(url(`/cycles/${id}`));

