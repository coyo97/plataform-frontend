// ui/features/academicHelp/organisms/CreateHelpForm.tsx
import React, { useEffect, useState } from 'react';
import { RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import FileButton   from '../../../shared/atoms/buttons/fileButton/FileButton';
import MainInput    from '../../../shared/atoms/inputs/MainInput';
import SmartBox     from '../../../shared/atoms/box/SmartBox';
import CascadingSelector from '../../../shared/molecules/CascadingSelector/CascadingSelector';
import { createHelpRequest, updateMyHelp } from '../../../../async/services/academicHelpService';
import type { AcademicHelp } from '../../../../types/academicHelp';

interface Props {
	onCreated(help: AcademicHelp): void;
	/** ⬇ NUEVO: edición */
	mode?: 'create' | 'edit';
	helpId?: string;
	initial?: Partial<AcademicHelp>;
	onUpdated?(help: AcademicHelp): void;
}

const CreateHelpForm: React.FC<Props> = ({
	onCreated,
	mode = 'create',
	helpId,
	initial,
	onUpdated
}) => {
	const [requestType, setType] = useState<'concept_question'|'need_notes'|'need_exam'|'need_assignment'>('concept_question');

	const [meta, setMeta] = useState<{
		facultyId?: string;
		careerId?:  string;
		subjectId?: string;
		unitId?:    string;
		cycleId?:   string;
	}>({});

	const [topic, setTopic]      = useState('');
	const [description, setDesc] = useState('');
	const [file, setFile]        = useState<File | null>(null);

	// ⬇ Prefill cuando es edición
	useEffect(() => {
		if (mode === 'edit' && initial) {
			setType((initial as any)?.requestType ?? 'concept_question');
			setMeta({
				facultyId:  (initial as any)?.facultyId?._id || (initial as any)?.facultyId,
				careerId:   (initial as any)?.careerId?._id  || (initial as any)?.careerId,
				subjectId:  (initial as any)?.subjectId?._id || (initial as any)?.subjectId,
				unitId:     (initial as any)?.unitId?._id    || (initial as any)?.unitId,
				cycleId:    (initial as any)?.cycleId?._id   || (initial as any)?.cycleId,
			});
			setTopic(initial.topic ?? '');
			setDesc(initial.description ?? '');
		}
	}, [mode, initial]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append('requestType', requestType);
		fd.append('topic', topic);
		fd.append('description', description);
		Object.entries(meta).forEach(([k, v]) => v && fd.append(k, v as string));
		if (file) fd.append('file', file);

		if (mode === 'edit' && helpId) {
			const updated = await updateMyHelp(helpId, fd);
			onUpdated?.(updated);
			return;
		}

		const help = await createHelpRequest(fd);
		onCreated(help);

		// reset rápido (solo en crear)
		setType('concept_question');
		setMeta({});
		setTopic('');
		setDesc('');
		setFile(null);
	};

	return (
		<form onSubmit={handleSubmit}>
			<SmartBox column gap="px16" sx={{ maxWidth: 500, mx: 'auto' }}>
				<RadioGroup value={requestType} onChange={(_, v)=>setType(v as any)} row>
					<FormControlLabel value="concept_question" control={<Radio size="small"/>} label="Pregunta" />
					<FormControlLabel value="need_notes"        control={<Radio size="small"/>} label="Apuntes" />
					<FormControlLabel value="need_exam"         control={<Radio size="small"/>} label="Examen" />
					<FormControlLabel value="need_assignment"   control={<Radio size="small"/>} label="Tarea" />
				</RadioGroup>

				<Divider/>

				<CascadingSelector value={meta} onChange={setMeta} />

				<MainInput label="Título / tema" placeholder="Ej: Método de Gauss-Seidel" value={topic} onChange={setTopic} />
				<MainInput label="Descripción" placeholder="Describe brevemente tu duda o lo que buscas…" multiline rows={4} value={description} onChange={setDesc} />

				<FileButton onChange={e=>e.target.files && setFile(e.target.files[0])} />

				<FilledButton type="submit" colorType="primary" fullWidth>
					{mode === 'edit' ? 'Actualizar ayuda' : 'Publicar ayuda'}
				</FilledButton>
			</SmartBox>
		</form>
	);
};

export default CreateHelpForm;

