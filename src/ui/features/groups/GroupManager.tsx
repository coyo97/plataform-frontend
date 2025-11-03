// src/ui/features/groups/GroupManager.tsx
import React, { useEffect, useState, useMemo } from 'react';
import SmartBox      from '../../shared/atoms/box/SmartBox';
import Text          from '../../shared/atoms/typography/Text';
import MainInput     from '../../shared/atoms/inputs/MainInput';
import FilledButton  from '../../shared/atoms/buttons/filledButton/FilledButton';
import Loader        from '../../shared/atoms/feedback/loader/Loader';
import Alert         from '../../shared/atoms/feedback/alert/Alert';

import {
  listGroups,
  createGroup,
  // joinGroup,               
  deleteGroup,               
  leaveGroup,               
} from '../../../async/services/groupService';
import type { Group } from '../../../types/types';
import { GroupContainer, GroupList, GroupItem } from './groupManager.styles';

import { getUserId } from '../../../utils/auth/getUserId';


const GroupManager: React.FC = () => {
  const [groups, setGroups]         = useState<Group[]>([]);
  const [groupName, setGroupName]   = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [message, setMessage]       = useState<string>('');

  const currentUserId = useMemo(() => getUserId?.() ?? '', []);

  useEffect(() => {
    listGroups()
      .then(setGroups)
      .catch(() => setError('No se pudieron cargar los grupos'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    try {
      const { group } = await createGroup(groupName.trim(), description.trim());
      setGroups(prev => [...prev, group]);
      setGroupName('');
      setDescription('');
      setMessage(`Grupo "${group.name}" creado`);
    } catch {
      setError('Error creando el grupo');
    }
  };

  // 👉 NUEVO comportamiento: si soy creador = eliminar, si no = salir
  const handleDeleteOrLeave = async (g: Group) => {
    try {
      if (!currentUserId) { setError('Usuario no autenticado'); return; }

      const isOwner = (g as any).createdBy === currentUserId; // asegúrate que Group tenga createdBy en el tipo
      if (isOwner) {
        await deleteGroup(g._id);
        setGroups(prev => prev.filter(x => x._id !== g._id));
        setMessage(`Grupo "${g.name}" eliminado`);
      } else {
        await leaveGroup(g._id, );
        setGroups(prev => prev.filter(x => x._id !== g._id)); // ya no pertenezco → sácalo
        setMessage(`Saliste del grupo "${g.name}"`);
      }
    } catch {
      setError('No se pudo completar la acción');
    }
  };

  return (
    <GroupContainer>
      <Text as="h1" size="lg" weight="bold">
        Gestión&nbsp;de&nbsp;Grupos
      </Text>

      {loading && <Loader />}
      {error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}
      {message && <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>}


      {/* lista de grupos del usuario */}
      {!loading && !error && (
        <GroupList>
          {groups.map(g => {
            const isOwner = (g as any).createdBy === currentUserId;
            return (
              <GroupItem key={g._id}>
                <Text weight="medium">{g.name}</Text>
                <FilledButton
                  variant="text"
                  colorType={isOwner ? 'error' : 'secondary'}
                  onClick={() => handleDeleteOrLeave(g)}
                >
                  {isOwner ? 'Eliminar' : 'Salir'}
                </FilledButton>
              </GroupItem>
            );
          })}
        </GroupList>
      )}
    </GroupContainer>
  );
};

export default GroupManager;

