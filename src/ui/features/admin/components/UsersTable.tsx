import React from 'react';
import { Table, TableHead, TableBody } from '@mui/material';
import Text from '../../../shared/atoms/typography/Text';
import { StyledTableRow, StyledTableCell } from '../userManagement.styles';
import { UserRow } from './UserRow';
import type { User } from '../UserManagement';

interface Props {
  users: User[];
  onDeactivate: (id: string) => void;
  onReactivate: (id: string) => void;
  onBlacklist: (id: string) => void;
  onDelete: (id: string) => void;
}

const TABLE_MIN_WIDTH = 800;
const TABLE_HEADERS = ['Usuario', 'Email', 'Roles', 'Carreras', 'Estado', 'Reportes', 'Acciones'] as const;

export const UsersTable: React.FC<Props> = ({ users, onDeactivate, onReactivate, onBlacklist, onDelete }) => {
  return (
    <Table style={{ minWidth: TABLE_MIN_WIDTH }}>
      <TableHead>
        <StyledTableRow>
          {TABLE_HEADERS.map((h) => (
            <StyledTableCell key={h} {...(h === 'Reportes' ? { align: 'right' } : {})}>
              <Text
                as="span"
                size="sm"
                weight="medium"
                colorKey="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.3 }}
              >
                {h}
              </Text>
            </StyledTableCell>
          ))}
        </StyledTableRow>
      </TableHead>

      <TableBody>
        {users.map((user) => (
          <UserRow
            key={user._id}
            user={user}
            onDeactivate={onDeactivate}
            onReactivate={onReactivate}
            onBlacklist={onBlacklist}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}
