import { get, post }   from '../api';
import * as RV         from '../routes/streamViewerRoutes';
import getEnvVariables from '../../config/configEnvs';
import type { User }   from '../../types/User';

const { HOST, SERVICE } = getEnvVariables();
const url = (p:string) => `${HOST}${SERVICE}${p}`;

export const listViewers = async (streamId: string) => {
  const res = await get<{ viewers: User[] }>(url(RV.VIEWERS(streamId)), {});
  console.log('[VIEWERS-service] GET', streamId, '→', res.viewers);
  return res.viewers;
};

export const kickViewer  = (streamId:string, viewerId:string) =>
	post<void>(url(RV.KICK(streamId)), { viewerId });

//export const listLive  = () => listViewers('?live=true');     // solo activos
//export const listEnded = () => listViewers('?ended=true');
