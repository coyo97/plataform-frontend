import React, { useState, useEffect } from 'react';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import ConversationList from '../ConversationList/ConversationList';
import { Searchbox } from '../../Searchbox';
import { Panel }       from './inboxPanel.styles';

import type { Conversation } from '../ConversationList/ConversationList';

interface Props {
	conversations : Conversation[];        // users + groups mezclados
	activeId      : string | undefined;
	onSelect      : (id: string, isGroup: boolean) => void;

	isFloating?   : boolean;
	showPanel     : boolean;
	togglePanel   : () => void;
}

const InboxPanel: React.FC<Props> = ({
	conversations,
	activeId,
	onSelect,
	isFloating = false,
	showPanel,
	togglePanel,
}) => {
	const [isMobile, setIsMobile] = useState(false);

	// detecta resize
	useEffect(() => {
		const detect = () => setIsMobile(window.innerWidth <= 768 || isFloating);
		detect();
		window.addEventListener('resize', detect);
		return () => window.removeEventListener('resize', detect);
	}, [isFloating]);

	const body = (
		<Panel isMobile={isMobile} isFloating={isFloating} show={showPanel}>
			<Searchbox  />
			<ConversationList
				data={conversations}
				activeId={activeId}
				onSelect={onSelect}
			/>
		</Panel>
	);

	return (
		<>
			{(isMobile || isFloating) && (
				<FilledButton
					size="small"
					shape="square"
					colorType="info"
					btnVariant="ghost"
					onClick={togglePanel}
					sx={{ position:'absolute', top:10, left:10, zIndex:1200 }}
				>
					{showPanel ? '⬅' : '➡'}
				</FilledButton>
			)}
			{showPanel && body}
		</>
	);
};

export default InboxPanel;

