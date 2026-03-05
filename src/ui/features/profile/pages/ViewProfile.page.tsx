// ui/features/profile/pages/ViewProfile.page.tsx
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
import BlockedUsersList from '../../friends/pages/BlockedUsersList';
import { useProfile } from '../hooks/useProfile';

type TabKey = 'solicitudes' | 'amigos' | 'buscar' | 'bloqueados';

const TABS: { key: TabKey; label: string }[] = [
	{ key: 'solicitudes', label: 'Solicitudes' },
	{ key: 'amigos',      label: 'Amigos' },
	{ key: 'buscar',      label: 'Buscar usuarios' },
	{ key: 'bloqueados',  label: 'Bloqueados' },
];

function TabPanel(props: { value: TabKey; current: TabKey; children: React.ReactNode }) {
	const { value, current, children } = props;
	if (value !== current) return null;
	return <Box sx={{ mt: 2 }}>{children}</Box>;
}

interface ViewProfilePageProps {
	canViewFriendRequests?: boolean;
	canViewFriendsList?: boolean;
	canSearchUsers?: boolean;
	canViewBlockedUsers?: boolean;
}

const ViewProfilePage: React.FC<ViewProfilePageProps> = ({
	canViewFriendRequests = true,
	canViewFriendsList = true,
	canSearchUsers = true,
	canViewBlockedUsers = true,
}) => {
	const { profile, loading, error } = useProfile();
	const [params, setParams] = useSearchParams();

	// Tabs visibles según permisos
	const visibleTabs = TABS.filter((t) => {
		if (t.key === 'solicitudes' && !canViewFriendRequests) return false;
		if (t.key === 'amigos' && !canViewFriendsList) return false;
		if (t.key === 'buscar' && !canSearchUsers) return false;
		if (t.key === 'bloqueados' && !canViewBlockedUsers) return false;
		return true;
	});

	const fallbackTab: TabKey = visibleTabs[0]?.key ?? 'buscar';

	const currentParam = (params.get('tab') as TabKey) || fallbackTab;
	const currentTab: TabKey =
		visibleTabs.some((t) => t.key === currentParam) ? currentParam : fallbackTab;

	const handleChange = (_: React.SyntheticEvent, idx: number) => {
		const next = visibleTabs[idx].key;
		params.set('tab', next);
		setParams(params, { replace: true });
	};

	const tabIndex = visibleTabs.findIndex((t) => t.key === currentTab);

	if (loading) return <Loader />;
	if (error)   return <Alert variant="outlined">{error}</Alert>;
	if (!profile) return null;

	return (
		<GridContainer
			variant="desktopFluid"
			columns={{ xs: 4, sm: 8, md: 12 }}
			style={{ padding: '24px' }}
		>
			<GridColumn span={{ xs: 4, md: 8 }}>
				<SmartBox center>
					<ProfileDetails profile={profile} />
				</SmartBox>

				<Paper elevation={2} style={{ padding: 16, marginTop: 16 }}>
					<Tabs
						value={tabIndex}
						onChange={handleChange}
						variant="scrollable"
						scrollButtons="auto"
						aria-label="Opciones de perfil"
					>
						{visibleTabs.map((t) => (
							<Tab
								key={t.key}
								label={t.label}
								aria-controls={`panel-${t.key}`}
							/>
						))}
					</Tabs>

					{/* Paneles protegidos por permisos */}
					{canViewFriendRequests && (
						<TabPanel value="solicitudes" current={currentTab}>
							<FriendRequestsPage />
						</TabPanel>
					)}

					{canViewFriendsList && (
						<TabPanel value="amigos" current={currentTab}>
							<FriendsListPage />
						</TabPanel>
					)}

					{canSearchUsers && (
						<TabPanel value="buscar" current={currentTab}>
							<UserSearchPage />
						</TabPanel>
					)}

					{canViewBlockedUsers && (
						<TabPanel value="bloqueados" current={currentTab}>
							<BlockedUsersList />
						</TabPanel>
					)}
				</Paper>
			</GridColumn>
		</GridContainer>
	);
};

export default ViewProfilePage;

