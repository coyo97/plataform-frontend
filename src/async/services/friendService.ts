import { get, post, del }          from '../api';
import * as R                 from '../routes/friendRoutes';
import getEnvVariables        from '../../config/configEnvs';
import type { UserProfile }   from '../../types/profile';

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

/* ─── Solicitudes de amistad ───────────────────────────────────────── */
export const fetchFriendRequests = () =>
	get<{ friendRequests: UserProfile[] }>(url(R.FRIEND_REQUESTS), {})
.then(res => res.friendRequests);

export const acceptFriendRequest = (id: string) =>
	post<void>(url(R.FRIEND_REQUEST_ACCEPT(id)), {});

export const rejectFriendRequest = (id: string) =>
	post<void>(url(R.FRIEND_REQUEST_REJECT(id)), {});

export const searchUsers = (q: string) =>
  get<{ users: any[] }>(url(R.USERS_SEARCH), { q }).then(r => r.users);

export const sendFriendRequest = (id: string) =>
  post<void>(url(R.SEND_FRIEND_REQUEST(id)), {});

export const fetchFriends = () =>
  get<{ friends: any[] }>(url(R.FRIENDS_LIST), {}).then(r => r.friends);

export const removeFriend = (id: string) =>
  del<void>(url(R.FRIEND_REMOVE(id)));

export const blockUser = (id: string) =>
  post<void>(url(R.USER_BLOCK(id)), {});

export const fetchBlockedUsers = () =>
  get<{ blockedUsers: any[] }>(url(R.BLOCKED_USERS_LIST), {})
    .then(r => r.blockedUsers);

export const unblockUser = (id: string) =>
  post<void>(url(R.USER_UNBLOCK(id)), {});  
