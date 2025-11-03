import { get, post, del } from '../api';
import getEnvVariables from '../../config/configEnvs';
import * as R from '../routes/groupRoutes';
import { Group } from '../../types/types';
import { User } from '../../types/User';

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

/* ----- lecturas ----- */
export const listGroups = () =>
	get<{ groups: Group[] }>(url(R.GROUPS), {}).then(r => r.groups);

export const listGroupMembers = (groupId: string) =>
	get<{ members: User[] }>(url(R.GROUP_MEMBERS(groupId)), {}).then(r => r.members);

/* ----- mutaciones ----- */
export const createGroup = (name: string, description: string) =>
	post<{ group: Group }>(url(R.CREATE_GROUP), { name, description });

export const joinGroup = (groupId: string) =>
	post<{ group: Group }>(url(R.JOIN_GROUP(groupId)), {});

/* ----- mutaciones ----- */
export const addUserToGroup = (groupId: string, userId: string) =>
  post<{ group: Group }>(           //  tipo devuelto
    url(R.ADD_USER_TO_GROUP(groupId)),
    { userToAddId: userId }
  );

export const removeUserFromGroup = (groupId: string, userId: string) =>
  post<{ group: Group }>(           //  tipo devuelto
    url(R.REMOVE_USER_GROUP(groupId)),
    { userToRemoveId: userId }
  );

  export const deleteGroup = (groupId: string) =>
  del<{ message: string; groupId: string }>(url(R.DELETE_GROUP(groupId)));

/* ----- NUEVO: salir del grupo (usuario normal) ----- */
// async/services/groupService.ts
export const leaveGroup = (groupId: string) =>
  post<{ group: Group }>(url(R.LEAVE_GROUP(groupId)), {});

export const grantGroupAdmin = (groupId: string, userId: string) =>
  post<{ group: Group; message: string }>(url(R.GRANT_ADMIN(groupId)), { targetUserId: userId });

export const revokeGroupAdmin = (groupId: string, userId: string) =>
  post<{ group: Group; message: string }>(url(R.REVOKE_ADMIN(groupId)), { targetUserId: userId });
