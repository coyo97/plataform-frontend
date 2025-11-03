import React, { useEffect, useMemo, useState } from 'react';
import GroupIcon            from '@mui/icons-material/Group';
import PersonAddIcon        from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon     from '@mui/icons-material/PersonRemove';
import SecurityIcon         from '@mui/icons-material/Security';
import RemoveModeratorIcon  from '@mui/icons-material/RemoveModerator';

import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import Text         from '../../shared/atoms/typography/Text';
import Loader       from '../../shared/atoms/feedback/loader/Loader';
import Alert        from '../../shared/atoms/feedback/alert/Alert';

import { listGroups, listGroupMembers, addUserToGroup, removeUserFromGroup, grantGroupAdmin,     revokeGroupAdmin,   
} from '../../../async/services/groupService';
import { listUsers } from '../../../async/services/userService';
import type { Group } from '../../../types/types';
import type { User  } from '../../../types/User';

import { Wrapper, Section, Row, ListBox, ListItemBox } from './groupUser.styles';

// si ya tienes este helper úsalo; si no, reemplázalo por tu implementación
import { getUserId } from '../../../utils/auth/getUserId';

const GroupUser: React.FC = () => {
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

  // Cargamos SOLO grupos del usuario (ya lo hace tu endpoint)
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
    // createdBy puede venir como string o como {_id}, según tu schema; cubrimos ambos
    const createdBy = (selectedGroup as any).createdBy;
    return typeof createdBy === 'string'
      ? createdBy === currentUserId
      : createdBy?._id === currentUserId;
  }, [selectedGroup, currentUserId]);

  const isAdmin = useMemo(() => {
    if (!selectedGroup || !currentUserId) return false;
    const admins: any[] = (selectedGroup as any).admins ?? [];
    // admin puede ser array de strings o ObjectId poblado → comparamos ambos
    return admins.some(a => (typeof a === 'string' ? a : a?._id)?.toString() === currentUserId);
  }, [selectedGroup, currentUserId]);

  const canManageMembers = isCreator || isAdmin;   // agregar/eliminar usuarios
  const canManageAdmins  = isCreator;              // hacer/revocar admin (política: solo creador)

  const refreshMembers = () => groupId && listGroupMembers(groupId).then(setMembers);
  const resetFeedback  = () => { setError(null); setMessage(''); };

  // Handlers
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

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault(); resetFeedback();
    try {
      const { message: msg } = await grantGroupAdmin(groupId, adminTarget);
      setMessage(msg || 'Administrador asignado');
      setAdminTarget('');
      refreshMembers();
    } catch { setError('No se pudo asignar admin'); }
  };

  const handleRevokeAdmin = async (e: React.FormEvent) => {
    e.preventDefault(); resetFeedback();
    try {
      const { message: msg } = await revokeGroupAdmin(groupId, adminTarget);
      setMessage(msg || 'Administrador revocado');
      setAdminTarget('');
      refreshMembers();
    } catch { setError('No se pudo revocar admin'); }
  };

  return (
    <Wrapper>
      <Text as="h1" size="lg" weight="bold">
        <GroupIcon style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
        Gestión&nbsp;de&nbsp;Usuarios&nbsp;de&nbsp;Grupos
      </Text>

      {loading && <Loader />}
      {error   && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}
      {message && <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>}

      {/* selector de grupo (ya viene filtrado por pertenencia) */}
      <Section>
        <Text weight="medium">Seleccionar grupo</Text>
        <select
          value={groupId}
          onChange={e => {
            setGroupId(e.target.value);
            setUserToAdd('');
            setUserToRemove('');
            setAdminTarget('');
            setMessage('');
            setError(null);
          }}
        >
          <option value="">-- Seleccione un grupo --</option>
          {groups.map(g => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>
      </Section>

      {groupId && (
        <>
          {/* miembros → SIEMPRE visible */}
          <Section>
            <Row>
              <FilledButton onClick={refreshMembers} colorType="primary" startIcon={<GroupIcon />}>
                Ver miembros
              </FilledButton>
            </Row>

            {members.length > 0 && (
              <ListBox>
                <Text as="h3" weight="medium" style={{ padding: '4px 8px' }}>Miembros</Text>
                {members.map(m => (
                  <ListItemBox key={m._id}>
                    <Text size="sm">{m.username} ({m.email})</Text>
                  </ListItemBox>
                ))}
              </ListBox>
            )}
          </Section>

          {/* agregar usuario → SOLO creador o admin */}
          {canManageMembers && (
            <Section as="form" onSubmit={handleAdd}>
              <Text weight="medium">Agregar usuario</Text>
              <Row>
                <select
                  value={userToAdd}
                  onChange={e => setUserToAdd(e.target.value)}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">-- Seleccione usuario --</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.username}</option>
                  ))}
                </select>
                <FilledButton type="submit" colorType="success" startIcon={<PersonAddIcon />}>
                  Agregar
                </FilledButton>
              </Row>
            </Section>
          )}

          {/* eliminar usuario → SOLO creador o admin */}
          {canManageMembers && (
            <Section as="form" onSubmit={handleRemove}>
              <Text weight="medium">Eliminar usuario</Text>
              <Row>
                <select
                  value={userToRemove}
                  onChange={e => setUserToRemove(e.target.value)}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">-- Seleccione miembro --</option>
                  {members.map(m => (
                    <option key={m._id} value={m._id}>{m.username}</option>
                  ))}
                </select>
                <FilledButton type="submit" colorType="error" startIcon={<PersonRemoveIcon />}>
                  Eliminar
                </FilledButton>
              </Row>
            </Section>
          )}

          {/* permisos de administrador → SOLO creador */}
          {canManageAdmins && (
            <Section as="form" onSubmit={e => e.preventDefault()}>
              <Text weight="medium">Permisos de administrador</Text>
              <Row>
                <select
                  value={adminTarget}
                  onChange={e => setAdminTarget(e.target.value)}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">-- Seleccione miembro --</option>
                  {members.map(m => (
                    <option key={m._id} value={m._id}>{m.username}</option>
                  ))}
                </select>

                <FilledButton
                  onClick={handleGrantAdmin}
                  colorType="warning"
                  startIcon={<SecurityIcon />}
                  disabled={!adminTarget}
                >
                  Hacer admin
                </FilledButton>

                <FilledButton
                  onClick={handleRevokeAdmin}
                  colorType="secondary"
                  startIcon={<RemoveModeratorIcon />}
                  disabled={!adminTarget}
                >
                  Revocar admin
                </FilledButton>
              </Row>
            </Section>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default GroupUser;

