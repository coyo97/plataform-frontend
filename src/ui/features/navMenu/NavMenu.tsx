import React from 'react';
import { useQuery } from 'react-query';
import { me as getUser } from '../../../async/services/userService';
import List from './list/List';
import getEnvVariables from '../../../config/configEnvs';

const NavMenu: React.FC = () => {
  const { HOST, SERVICE } = getEnvVariables();
  const endpoint = `${HOST}${SERVICE}/users`;

  const payload = {};
  const { data, isLoading, isError } = useQuery("getUser", getUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data ) {
    return <div>Error loading users</div>;
  }
  
  return <p>hola</p>

  {/* return <List data={data} />;*/}
};

export default NavMenu;

