import React from 'react';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import RolesList from './RolesList';
import AssignRolesToUser from './AssignRolesToUser';
import UserListWithRoles from './UserListWithRoles';
import ActionManagement from './ActionManagement';
import ModuleManagement from './ModuleManagement';

const HomeRoles: React.FC = () => (
	<div>
		<ModuleManagement/>
		<ActionManagement/>
		<CreateRole/>
		<RolesList/>
		<AssignRolesToUser/>
		<UserListWithRoles/>
  </div>
);

export default HomeRoles;
