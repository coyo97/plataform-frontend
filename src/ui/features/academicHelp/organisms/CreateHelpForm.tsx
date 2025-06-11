// ui/features/academicHelp/organisms/CreateHelpForm.tsx
import React, { useState } from 'react';
import {
	RadioGroup, FormControlLabel, Radio, Divider
} from '@mui/material';

import FilledButton   from '../../../shared/atoms/buttons/filledButton/FilledButton';
import FileButton     from '../../../shared/atoms/buttons/fileButton/FileButton';
import MainInput      from '../../../shared/atoms/inputs/MainInput';
import SmartBox       from '../../../shared/atoms/box/SmartBox';

import CascadingSelector from '../../../shared/molecules/CascadingSelector/CascadingSelector';
import { createHelpRequest } from '../../../../async/services/academicHelpService';

import type { AcademicHelp } from '../../../../types/academicHelp';

/* ─────────────────────────────────────────────────────────── */

interface Props {
	/** callback al crear  */
	onCreated(help: AcademicHelp): void;
}

const CreateHelpForm: React.FC<Props> = ({ onCreated }) => {

	/* tipo de solicitud */
	const [requestType, setType] = useState<
	'concept_question' | 'need_notes' | 'need_exam' | 'need_assignment'
	>('concept_question');

	/* meta-datos en cascada */
	const [meta, setMeta] = useState<{
		facultyId?: string;
		careerId?:  string;
		subjectId?: string;
		unitId?:    string;
		cycleId?:   string;
	}>({});

	/* campos libres */
	const [topic, setTopic]       = useState('');
	const [description, setDesc]  = useState('');
	const [file, setFile]         = useState<File | null>(null);

	/* enviar -------------------------------------------------- */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const fd = new FormData();

		/* básicos */
		fd.append('requestType', requestType);
		fd.append('topic', topic);
		fd.append('description', description);

		/* catálogos: solo los presentes */
		Object.entries(meta).forEach(([k, v]) => v && fd.append(k, v));
		if (file) fd.append('file', file);

		const help = await createHelpRequest(fd);
		onCreated(help);

		/* reset rápido */
		setType('concept_question');
		setMeta({});
		setTopic('');
		setDesc('');
		setFile(null);
	};

	/* UI ------------------------------------------------------ */
	return (
		<form onSubmit={handleSubmit}>
			<SmartBox column gap="px16" sx={{ maxWidth: 500, mx: 'auto' }}>

				{/* ① Tipo de solicitud */}
				<RadioGroup
					value={requestType}
					onChange={(_, v)=>setType(v as any)}
					row
				>
					<FormControlLabel
						value="concept_question" control={<Radio size="small"/>}
						label="Pregunta"
					/>
					<FormControlLabel
						value="need_notes" control={<Radio size="small"/>}
						label="Apuntes"
					/>
					<FormControlLabel
						value="need_exam" control={<Radio size="small"/>}
						label="Examen"
					/>
					<FormControlLabel
						value="need_assignment" control={<Radio size="small"/>}
						label="Tarea"
					/>
				</RadioGroup>

				<Divider/>

				{/* ② Selector en cascada */}
				<CascadingSelector value={meta} onChange={setMeta} />

				{/* ③ Campos libres */}
				<MainInput
					label="Título / tema"
					placeholder="Ej: Método de Gauss-Seidel"
					value={topic}
					onChange={setTopic}
				/>

				<MainInput
					label="Descripción"
					placeholder="Describe brevemente tu duda o lo que buscas…"
					multiline rows={4}
					value={description}
					onChange={setDesc}
				/>

				{/* ④ Archivo opcional */}
				<FileButton
					onChange={e=>e.target.files && setFile(e.target.files[0])}
				/>

				{/* ⑤ CTA */}
				<FilledButton type="submit" colorType="primary" fullWidth>
					Publicar ayuda
				</FilledButton>

			</SmartBox>
		</form>
	);
};

export default CreateHelpForm;

