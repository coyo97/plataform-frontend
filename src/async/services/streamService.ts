import { get, post, put, del } from '../api';
import getEnvVariables         from '../../config/configEnvs';
import * as R                  from '../routes/streamRoutes';
import type { Stream }         from '../../types/stream';

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

/* endpoint genérico; ahora es privado al módulo */
export const list = async (q = ''): Promise<Stream[]> => {
  const { streams } = await get<{streams: Stream[]}>(url(`${R.STREAMS}${q}`), {});
  return streams;
};

/** Crea un nuevo stream */
export const create = async (payload: Partial<Stream>) =>
	post<{ stream: Stream; accessCode?: string }>(url(R.STREAMS), payload);

/** Finaliza (soft-delete) un stream propio */
export const stop   = async (id: string) =>
	del<{ message: string }>(url(R.STREAM(id)));

/** Marca endedAt sin borrar (PUT /end) */
export const end    = async (id: string) =>
	put<{ stream: Stream }>(url(R.END_STREAM(id)), {});

/** Únete a un stream (valida código) */
export const join   = async (id: string, accessCode?: string) =>
	post<{ stream: Stream }>(url(R.JOIN_STREAM(id)), { accessCode });

/** Like / Unlike */
export const like    = (id: string) => post<{ likes: number }>(url(R.LIKE_STREAM(id)), {});
export const unlike  = (id: string) => post<{ likes: number }>(url(R.UNLIKE_STREAM(id)), {});

/** Incrementa contador de vistas (no requiere auth) */
export const view    = (id: string) => post<void>(url(R.VIEW_STREAM(id)), {});


// ── streamService.ts ───────────────────────────────────────────
export const listLive  = () => list('?live=true');   // Stream[]
export const listEnded = () => list('?ended=true');  // Stream[]
export const listAll    = () => list('');                   // sin query

