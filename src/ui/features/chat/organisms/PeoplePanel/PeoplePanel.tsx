// PeoplePanel.tsx
import React, { useEffect, useState } from 'react';
import ChatSidebar  from '../ChatSidebar/ChatSidebar';
import { Searchbox } from '../../Searchbox';
import IconButton   from '../../../../shared/atoms/buttons/iconButton/IconButton';
import MenuIcon     from '@mui/icons-material/Menu';

import { Wrapper, ToggleBtn } from './peoplePanel.styles';
import type { PeoplePanelProps } from './peoplePanel.types';

const PeoplePanel:React.FC<PeoplePanelProps> = ({
	users, groups, activeId,
	onSelectUser, onSelectGroup,
	floating = false,
}) => {

	/** break-point ≤ 768 px -> vista móvil */
	const [mobile, setMobile] = useState(window.innerWidth <= 768);
	const [open  , setOpen  ] = useState(!mobile || !floating);

	/* -------- eventos de resize -------- */
	useEffect(() => {
		const handler = () => setMobile(window.innerWidth <= 768);
		window.addEventListener('resize', handler);
		return () => window.removeEventListener('resize', handler);
	}, []);

	const shouldShow = open || (!mobile && !floating);

	return (
		<>
			{(mobile || floating) && (
				<ToggleBtn onClick={()=>setOpen(o=>!o)}>
					{open ? '⨯' : <MenuIcon fontSize="small" />}
				</ToggleBtn>
			)}

			<Wrapper show={shouldShow} floating={floating}>
				<Searchbox />
				<ChatSidebar
					users={users}
					groups={groups}
					activeId={activeId}
					onSelectUser={id => { onSelectUser(id); mobile && setOpen(false); }}
					onSelectGroup={id => { onSelectGroup(id); mobile && setOpen(false); }}
				/>
			</Wrapper>
		</>
	);
};

export default PeoplePanel;

