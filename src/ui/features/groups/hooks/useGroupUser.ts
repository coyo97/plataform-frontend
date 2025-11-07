// src/ui/features/groups/hooks/useGroupUser.ts
import { useEffect, useMemo, useState, HTMLAttributes } from 'react';
import { listGroups, listGroupMembers, addUserToGroup, removeUserFromGroup, grantGroupAdmin, revokeGroupAdmin } from '../../../../async/services/groupService';
import { listUsers } from '../../../../async/services/userService';
import type { Group } from '../../../../types/types';
import type { User } from '../../../../types/User';
import { getUserId } from '../../../../utils/auth/getUserId';

export function useGroupUser() {
	const [groups, setGroups]             = useState<Group[]>([]);
	const [users, setUsers]               = useState<User[]>([]);
	const [members, setMembers]           = useState<User[]>([]);

	const [groupId, setGroupId]           = useState('');
	const [userToAdd, setUserToAdd]       = useState('');
	const [userToRemove, setUserToRemove] = useState('');
	const [adminTarget, setAdminTarget]   = useState('');

	const [loading, setLoading]           = useState(true);
	const [error, setError]               = useState<string | null>(null);
	const [message, setMessage]           = useState('');

	const currentUserId = useMemo(() => getUserId?.() ?? '', []);

	// Carga inicial (grupos del usuario + usuarios)
	useEffect(() => {
		Promise.all([listGroups(), listUsers()])
		.then(([g, u]) => { setGroups(g); setUsers(u); })
		.catch(() => setError('No se pudieron cargar datos'))
		.finally(() => setLoading(false));
	}, []);

	// Cargar miembros del grupo seleccionado
	useEffect(() => {
		if (!groupId) { setMembers([]); return; }
		listGroupMembers(groupId)
		.then(setMembers)
		.catch(() => setError('No se pudieron cargar los miembros'));
	}, [groupId]);

	const selectedGroup = useMemo(
		() => groups.find(g => g._id === groupId),
		[groups, groupId]
	);

	// Permisos
	const isCreator = useMemo(() => {
		if (!selectedGroup || !currentUserId) return false;
		const createdBy = (selectedGroup as any).createdBy;
		return typeof createdBy === 'string'
			? createdBy === currentUserId
			: createdBy?._id === currentUserId;
	}, [selectedGroup, currentUserId]);

	const isAdmin = useMemo(() => {
		if (!selectedGroup || !currentUserId) return false;
		const admins: any[] = (selectedGroup as any).admins ?? [];
		return admins.some(a => (typeof a === 'string' ? a : a?._id)?.toString() === currentUserId);
	}, [selectedGroup, currentUserId]);

	const canManageMembers = isCreator || isAdmin;   // agregar/eliminar usuarios
	const canManageAdmins  = isCreator;              // hacer/revocar admin

	const refreshMembers = () => groupId && listGroupMembers(groupId).then(setMembers);
	const resetFeedback  = () => { setError(null); setMessage(''); };

	// Helpers de rol por miembro
	const isMemberCreator = (m: User) => {
		const createdBy = (selectedGroup as any)?.createdBy;
		const id = typeof createdBy === 'string' ? createdBy : createdBy?._id;
		return !!id && m._id === id;
	};

	const isMemberAdmin = (m: User) => {
		const admins: any[] = (selectedGroup as any)?.admins ?? [];
		return admins.some(a => (typeof a === 'string' ? a : a?._id)?.toString() === m._id);
	};

	// Render de opción usuario (para Autocomplete con avatar + badges)
	const renderUserOption =
		(props: HTMLAttributes<HTMLLIElement>, u: User) => {
		const creator = isMemberCreator(u);
		const admin   = isMemberAdmin(u);
		return { props, u, creator, admin };
	};

	const getUserOptionLabel = (u: User | null) =>
		u ? `${u.username} — ${u.email}` : '';

	// Handlers
	const handleSelectGroup = (g: Group | null) => {
		const nextId = g?._id ?? '';
		setGroupId(nextId);
		setUserToAdd('');
		setUserToRemove('');
		setAdminTarget('');
		setMessage('');
		setError(null);
	};

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault(); resetFeedback();
		try {
			const { group } = await addUserToGroup(groupId, userToAdd);
			setMessage(`Usuario agregado a ${group.name}`);
			setUserToAdd('');
			refreshMembers();
		} catch { setError('Error al agregar usuario'); }
	};

	const handleRemove = async (e: React.FormEvent) => {
		e.preventDefault(); resetFeedback();
		try {
			const { group } = await removeUserFromGroup(groupId, userToRemove);
			setMessage(`Usuario eliminado de ${group.name}`);
			setUserToRemove('');
			refreshMembers();
		} catch { setError('Error al eliminar usuario'); }
	};

	const handleQuickRemove = async (memberId: string) => {
		resetFeedback();
		try {
			await removeUserFromGroup(groupId, memberId);
			setMessage('Usuario eliminado');
			refreshMembers();
		} catch { setError('Error al eliminar usuario'); }
	};

	const handleGrantAdmin = async (e: React.FormEvent) => {
		e.preventDefault(); resetFeedback();
		try {
			const { message: msg } = await grantGroupAdmin(groupId, adminTarget);
			// parchea admins en memoria → UI instantánea
			patchGroupAdmins(adminTarget, 'add');
			setMessage(msg || 'Administrador asignado');
			setAdminTarget('');
			refreshMembers(); // opcional, para sincronizar nombres/cambios
		} catch { setError('No se pudo asignar admin'); }
	};

	const handleRevokeAdmin = async (e: React.FormEvent) => {
		e.preventDefault(); resetFeedback();
		try {
			const { message: msg } = await revokeGroupAdmin(groupId, adminTarget);
			patchGroupAdmins(adminTarget, 'remove');
			setMessage(msg || 'Administrador revocado');
			setAdminTarget('');
			refreshMembers();
		} catch { setError('No se pudo revocar admin'); }
	};

	const handleQuickGrant = async (memberId: string) => {
		resetFeedback();
		try {
			const { message: msg } = await grantGroupAdmin(groupId, memberId);
			patchGroupAdmins(memberId, 'add');
			setMessage(msg || 'Admin asignado');
			refreshMembers();
		} catch { setError('No se pudo asignar admin'); }
	};

	const handleQuickRevoke = async (memberId: string) => {
		resetFeedback();
		try {
			const { message: msg } = await revokeGroupAdmin(groupId, memberId);
			patchGroupAdmins(memberId, 'remove');
			setMessage(msg || 'Admin revocado');
			refreshMembers();
		} catch { setError('No se pudo revocar admin'); }
	};

	const patchGroupAdmins = (memberId: string, op: 'add' | 'remove') => {
		setGroups(prev =>
				  prev.map(g => {
			if (g._id !== groupId) return g;
			const old = (g as any).admins ?? [];
			const asStrings = old.map((a: any) => (typeof a === 'string' ? a : a?._id?.toString()));
			if (op === 'add') {
				if (asStrings.includes(memberId)) return g;
				return { ...g, admins: [...old, memberId] } as Group;
			}
			// remove
			return {
				...g,
				admins: old.filter((a: any) => {
					const id = typeof a === 'string' ? a : a?._id?.toString();
					return id !== memberId;
				}),
			} as Group;
		})
				 );
	};

	return {
		// datos
		groups, users, members, selectedGroup,
		// ids seleccionados
		groupId, setGroupId,
		userToAdd, setUserToAdd,
		userToRemove, setUserToRemove,
		adminTarget, setAdminTarget,
		// estado ui
		loading, error, setError, message, setMessage,
		// permisos
		isCreator, isAdmin, canManageMembers, canManageAdmins,
		// helpers
		isMemberCreator, isMemberAdmin, getUserOptionLabel, renderUserOption,
		// acciones
		handleSelectGroup,
		handleAdd, handleRemove, handleGrantAdmin, handleRevokeAdmin,
		handleQuickRemove, handleQuickGrant, handleQuickRevoke,
	};
}

