import React, { useEffect, useState } from 'react';
import { list as fetchCareers } from '../../../../async/services/careerService';
import CareerSelector from '../../../shared/molecules/selector/CareerSelector';
import TextField from '../../../shared/atoms/textFields/TextField';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import { create as createStream } from '../../../../async/services/streamService';
import type { Career } from '../../../../types/publication';
import GhostButton from '../../../shared/atoms/buttons/ghostButton/GhostButton';

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

	useEffect(() => {
		fetchCareers().then(setCareers).catch(console.error);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const payload: any = {
			title,
			visibility,
			description
		};
		if (visibility === 'career') {
			payload.careerIds = [careerId]; // compatibilidad con backend
		}

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
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<SmartBox column gap="px12">

				<TextField
					label="Título del stream"
					value={title}
					onChange={setTitle}
				/>
				<TextField
					label="Descripción del stream"
					value={description}
					onChange={setDescription}
				/>

				<select
					value={visibility}
					onChange={(e) => setVisibility(e.target.value as any)}
				>
					<option value="university">Universidad</option>
					<option value="career">Carrera</option>
					<option value="private">Privado</option>
				</select>

				{visibility === 'career' && (
					<CareerSelector
						careers={careers}
						value={careerId}
						onChange={setCareerId}
						label="Selecciona la carrera"
						variant="transparent"
					/>
				)}

				<GhostButton colorType="secondary" type="submit" label='Iniciar Stream'>
				</GhostButton>

				{accessCode && (
					<p>Código de acceso generado: <strong>{accessCode}</strong></p>
				)}
			</SmartBox>
		</form>
	);
};

export default StreamCreateForm;

