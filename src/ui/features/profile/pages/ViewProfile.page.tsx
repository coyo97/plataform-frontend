import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Loader from '../../../shared/atoms/feedback/loader/Loader';
import Alert from '../../../shared/atoms/feedback/alert/Alert';

import GridColumn from '../../../shared/atoms/grid/GridColumn';
import GridContainer from '../../../shared/atoms/grid/GridContainer';

import { Paper, Tabs, Tab, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import ProfileDetails from '../organisms/ProfileDetails/ProfileDetails';
import FriendRequestsPage from '../../friends/pages/FriendRequests.page';
import FriendsListPage from '../../friends/pages/FriendsList.page';
import UserSearchPage from '../../friends/pages/UserSearch.page';
import { useProfile } from '../hooks/useProfile';

type TabKey = 'solicitudes' | 'amigos' | 'buscar';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'solicitudes', label: 'Solicitudes' },
  { key: 'amigos',      label: 'Amigos' },
  { key: 'buscar',      label: 'Buscar usuarios' },
];

function TabPanel(props: { value: TabKey; current: TabKey; children: React.ReactNode }) {
  const { value, current, children } = props;
  if (value !== current) return null;
  return <Box sx={{ mt: 2 }}>{children}</Box>;
}

const ViewProfilePage: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const [params, setParams] = useSearchParams();

  const defaultTab: TabKey = 'solicitudes';
  const currentParam = (params.get('tab') as TabKey) || defaultTab;
  const currentTab: TabKey = TABS.some(t => t.key === currentParam) ? currentParam : defaultTab;

  const handleChange = (_: React.SyntheticEvent, idx: number) => {
    const next = TABS[idx].key;
    params.set('tab', next);
    setParams(params, { replace: true });
  };

  const tabIndex = TABS.findIndex(t => t.key === currentTab);

  if (loading) return <Loader />;
  if (error)   return <Alert variant="outlined">{error}</Alert>;
  if (!profile) return null;

  return (
    <GridContainer
      variant="desktopFluid"
      columns={{ xs: 4, sm: 8, md: 12 }}
      style={{ padding: '24px' }}
    >
      {/* Encabezado (perfil) */}
      <GridColumn span={{ xs: 4 }}>
        <SmartBox center>
          <ProfileDetails profile={profile} />
        </SmartBox>
      </GridColumn>

      {/* Contenedor de Tabs (una sola columna a lo ancho) */}
      <GridColumn span={{ xs: 4 }}>
        <Paper elevation={2} style={{ padding: 16 }}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Opciones de perfil"
          >
            {TABS.map((t) => (
              <Tab key={t.key} label={t.label} aria-controls={`panel-${t.key}`} />
            ))}
          </Tabs>

          <TabPanel value="solicitudes" current={currentTab}>
            <FriendRequestsPage />
          </TabPanel>

          <TabPanel value="amigos" current={currentTab}>
            <FriendsListPage />
          </TabPanel>

          <TabPanel value="buscar" current={currentTab}>
            <UserSearchPage />
          </TabPanel>
        </Paper>
      </GridColumn>
    </GridContainer>
  );
};

export default ViewProfilePage;

