//features/publications/organisms/sidebars/CreatePublicationSidebar.tsx
import React, { useEffect, useState } from 'react';

import Sidebar from '../../../../shared/organisms/sidebar/Sidebar';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import Text from '../../../../shared/atoms/typography/Text';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';

import CreatePublicationDialog from '../CreatePublicationDialog';

import {
	fetchCareers,
	createPublication,
} from '../../../../../async/services/publicationService';
import type { Career, Publication } from '../../../../../types/publication';

interface Props {
	onNew   : (pub: Publication) => void;
	open    : boolean;       // controla Drawer móvil
	onClose : () => void;
}

const CreatePublicationSidebar: React.FC<Props> = ({
	onNew, open, onClose,
}) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [careers, setCareers] = useState<Career[]>([]);

	useEffect(() => {
		fetchCareers().then(setCareers).catch(console.error);
	}, []);

	const handleSubmit = async (fd: FormData) => {
		const pub = await createPublication(fd);
		onNew(pub);
		return pub;
	};

	return (
		<Sidebar
			sticky
			width={220}
			variant="flat"
			//header={<Text weight="bold">Crear publicación</Text>}
			open={open}
			onClose={onClose}
		>
			<SmartBox >
				<FilledButton
					colorType="warning"
					fullWidth
					onClick={() => setDialogOpen(true)}
				>
					Publicar
				</FilledButton>
			</SmartBox>

			<CreatePublicationDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				careers={careers}
				onNew={onNew}
				onSubmit={handleSubmit}
			/>
		</Sidebar>
	);
};

export default CreatePublicationSidebar;

