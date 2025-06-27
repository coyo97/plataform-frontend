// src/ui/features/stream/organisms/StreamCreateForm.tsx
import React, { useEffect, useState } from 'react';
import { list as fetchCareers } from '../../../../async/services/careerService';
import { create as createStream } from '../../../../async/services/streamService';

import SmartBox from '../../../shared/atoms/box/SmartBox';
import TextField from '../../../shared/atoms/textFields/TextField';
import RadioGroup from '../../../shared/atoms/RadioGroup/RadioGroup';
import CareerSelector from '../../../shared/molecules/selector/CareerSelector';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../../shared/atoms/buttons/ghostButton/GhostButton';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';

import type { Career } from '../../../../types/publication';

import mq from '../../../../config/mq';

interface Props {
	onStreamCreated: (id: string, accessCode?: string) => void;
}

const StreamCreateForm: React.FC<Props> = ({ onStreamCreated }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [visibility, setVisibility] = useState<'university' | 'career' | 'private'>('university');
	const [careers, setCareers] = useState<Career[]>([]);
	const [careerId, setCareerId] = useState('');
	const [accessCode, setAccessCode] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchCareers().then(setCareers).catch(console.error);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const payload: any = { title, visibility, description };
		if (visibility === 'career') payload.careerIds = [careerId];

		try {
			const res = await createStream(payload);
			localStorage.setItem('activeStreamId', res.stream._id);
			localStorage.setItem('isStreamer', 'true');
			if (res.accessCode) {
				localStorage.setItem('accessCode', res.accessCode);
				setAccessCode(res.accessCode);
			}
			onStreamCreated(res.stream._id, res.accessCode);
		} catch (err) {
			console.error('Error al crear el stream:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>

			<SmartBox
				column
				gap="px12"
				sx={{
					maxWidth: 560,
					margin: '0 auto',
					[mq('md', 'min')]: { maxWidth: 720 },
				}}
			>
				<TextField label="Título del stream" value={title} onChange={setTitle} />

				<TextField
					label="Descripción del stream"
					value={description}
					onChange={setDescription}
					multiline
					rows={3}
				/>

				{/* Selector de visibilidad más amigable que un <select> */}
				<RadioGroup
					legend="Visibilidad"
					value={visibility}
					onChange={(val) => setVisibility(val as 'university' | 'career' | 'private')}
					variant="segmented"
					// StreamCreateForm.tsx  – solo cambias la definición de cada icono
					options={[
						{ value: 'university', label: 'Universidad', icon: <PublicIcon fontSize="small" /> },
						{ value: 'career',     label: 'Carrera',     icon: <SchoolIcon fontSize="small" /> },
						{ value: 'private',    label: 'Privado',     icon: <LockIcon   fontSize="small" /> },
					]}
				/>

				{visibility === 'career' && (
					<CareerSelector
						careers={careers}
						value={careerId}
						onChange={setCareerId}
						label="Selecciona la carrera"
						variant="default"
					/>
				)}

				{/* Acciones */}
				<SmartBox row gap="px8" sx={{ justifyContent: 'flex-end', flexWrap: 'wrap', rowGap: '12px',  mt: '12px',  }}>
					<GhostButton
						colorType="secondary"
						type="reset"
						label="Limpiar"
						disabled={loading}
					/>
					<FilledButton
						type="submit"
						loading={loading}
						disabled={!title.trim()}
					>
						Iniciar stream
					</FilledButton>

				</SmartBox>

				{accessCode && (
					<p>
						Código de acceso generado:&nbsp;
						<strong>{accessCode}</strong>
					</p>
				)}
			</SmartBox>
		</form>
	);
};

export default StreamCreateForm;

