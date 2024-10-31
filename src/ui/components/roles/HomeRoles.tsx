import React from 'react';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import RolesList from './RolesList';
import AssignRolesToUser from './AssignRolesToUser';
import UserListWithRoles from './UserListWithRoles';

const HomeRoles: React.FC = () => (
	<div>
		<CreateRole/>
		<RolesList/>
		<AssignRolesToUser/>
		<UserListWithRoles/>
  </div>
);

export default HomeRoles;
