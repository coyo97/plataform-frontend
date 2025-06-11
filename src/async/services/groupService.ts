import { get, post } from '../api';
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
  post<{ group: Group }>(           // 👈 tipo devuelto
    url(R.ADD_USER_TO_GROUP(groupId)),
    { userToAddId: userId }
  );

export const removeUserFromGroup = (groupId: string, userId: string) =>
  post<{ group: Group }>(           // 👈 tipo devuelto
    url(R.REMOVE_USER_GROUP(groupId)),
    { userToRemoveId: userId }
  );

