// ui/features/academicHelp/organisms/CreateHelpForm.tsx
import React, { useEffect, useState } from 'react';
import {
	RadioGroup,
	FormControlLabel,
	Radio,
	Divider,
	Typography,
	Box,
	LinearProgress,
	Switch,
} from '@mui/material';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import FileButton   from '../../../shared/atoms/buttons/fileButton/FileButton';
import MainInput    from '../../../shared/atoms/inputs/MainInput';
import SmartBox     from '../../../shared/atoms/box/SmartBox';
import CascadingSelector from '../../../shared/molecules/CascadingSelector/CascadingSelector';
import ModerationAlert from '../../../shared/molecules/moderation/ModerationAlert';
import { resolveErrorMessage } from '../../../shared/utils/validation/moderationError';
import Text from '../../../shared/atoms/typography/Text';

import { createHelpRequest, updateMyHelp } from '../../../../async/services/academicHelpService';
import type { AcademicHelp } from '../../../../types/academicHelp';

import { validateHelpTitle, validateHelpBody } from '../../../shared/utils/validation/validators';

import { getAccountType } from '../../../../utils/auth/getUserId';

interface Props {
	onCreated(help: AcademicHelp): void;
	mode?: 'create' | 'edit';
	helpId?: string;
	initial?: Partial<AcademicHelp>;
	onUpdated?(help: AcademicHelp): void;
}

type RequestType = 'concept_question' | 'need_notes' | 'need_exam' | 'need_assignment';
type HelpScope   = 'career' | 'general';

interface MetaSelection {
	facultyId?: string;
	careerId?:  string;
	subjectId?: string;
	unitId?:    string;
	cycleId?:   string;
}

interface HelpFormErrors {
	topic?: string;
	description?: string;
	meta?: string;
}

const CreateHelpForm: React.FC<Props> = ({
	onCreated,
	mode = 'create',
	helpId,
	initial,
	onUpdated
}) => {
	const accountType = getAccountType(); 
	const isUniversity = accountType === 'university';

	const [requestType, setType] = useState<RequestType>('concept_question');
	const [scope, setScope] = useState<HelpScope>('career'); 

	const [meta, setMeta] = useState<MetaSelection>({});
	const [topic, setTopic] = useState('');
	const [description, setDesc] = useState('');
	const [file, setFile] = useState<File | null>(null);

	const [errors, setErrors] = useState<HelpFormErrors>({});
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const [advancedMode, setAdvancedMode] = useState(false);

	useEffect(() => {
		if (!isUniversity) {
			setScope('general');  
			setAdvancedMode(false);
		} else {
			setScope('career');  
		}
	}, [isUniversity]);

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

			const initialScope = (initial as any)?.scope as HelpScope | undefined;
			if (initialScope === 'general') {
				setScope('general');
				setAdvancedMode(false);
			} else {
				setScope('career');
				if (
					(initial as any)?.subjectId ||
					(initial as any)?.careerId  ||
					(initial as any)?.facultyId ||
					(initial as any)?.unitId    ||
					(initial as any)?.cycleId
				) {
					setAdvancedMode(true);
				}
			}
		}
	}, [mode, initial]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (loading) return;

		setErrorMsg(null);

		const newErrors: HelpFormErrors = {
			topic: validateHelpTitle(topic),
			description: validateHelpBody(description),
			meta: undefined,
		};

		if (scope === 'career' && advancedMode && !meta.subjectId && !meta.careerId) {
			newErrors.meta = 'Selecciona al menos la materia o la carrera para tu solicitud de ayuda.';
		}

		const hasErrors = Object.values(newErrors).some((e) => !!e);
		if (hasErrors) {
			setErrors(newErrors);
			return;
		}

		setErrors({});

		const fd = new FormData();
		fd.append('requestType', requestType);
		fd.append('topic', topic);
		fd.append('description', description);
		fd.append('scope', scope); 

		if (scope === 'career') {
			Object.entries(meta).forEach(([k, v]) => v && fd.append(k, v as string));
		}

		if (file) fd.append('file', file);

		try {
			setLoading(true);

			if (mode === 'edit' && helpId) {
				const updated = await updateMyHelp(helpId, fd);
				onUpdated?.(updated);
				return;
			}

			const help = await createHelpRequest(fd);
			onCreated(help);

			if (mode === 'create') {
				setType('concept_question');
				setMeta({});
				setTopic('');
				setDesc('');
				setFile(null);
			}
		} catch (err: any) {
			console.error('Error al enviar solicitud de ayuda:', err);

			const backendMsg: string | undefined =
				err?.response?.data?.message ||
				err?.message;

			// Caso especial: el backend no pudo determinar la carrera
			if (backendMsg && backendMsg.includes('No se pudo determinar la carrera')) {
				// Forzamos alcance por carrera y activamos modo avanzado
				setScope('career');
				setAdvancedMode(true);

				setErrors((prev) => ({
					...prev,
					meta: 'Selecciona al menos la materia o carrera en las opciones avanzadas.',
				}));

				setErrorMsg(null);
				return;
			}

			const userMsg = resolveErrorMessage(err, {
				generic   : 'No se pudo registrar la solicitud de ayuda. Inténtalo nuevamente.',
				moderation: 'La solicitud fue bloqueada por moderación. Revisa que el tema, la descripción y el archivo (imagen/video) cumplan las políticas.',
				fileType  : 'Tipo de archivo no permitido para la ayuda académica. Revisa las extensiones permitidas.',
				fileSize  : 'El archivo que intentas subir es demasiado grande para la ayuda académica.',
			});

			setErrorMsg(userMsg);
		} finally {
			setLoading(false);
		}
	};

	const handleMetaChange = (value: MetaSelection) => {
		setMeta(value);
		setErrors((prev) => ({ ...prev, meta: undefined }));
	};

	const handleTopicChange = (value: string) => {
		setTopic(value);
		setErrors((prev) => ({ ...prev, topic: undefined }));
	};

	const handleDescChange = (value: string) => {
		setDesc(value);
		setErrors((prev) => ({ ...prev, description: undefined }));
	};

	const handleToggleAdvanced = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setAdvancedMode(checked);
		if (!checked) {
			setErrors((prev) => ({ ...prev, meta: undefined }));
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<ModerationAlert
				message={errorMsg}
				onClose={() => setErrorMsg(null)}
			/>

			<SmartBox column gap="px16" sx={{ maxWidth: 500, mx: 'auto' }}>
				{/* Tarjeta guía según tipo de usuario */}
				<SmartBox
					column
					gap="px4"
					sx={{
						p: 2,
						borderRadius: 2,
						border: '1px solid',
						borderColor: 'divider',
						backgroundColor: 'background.paper',
					}}
				>
					<Text headingLevel='h4'>
						¿Cómo se publicará tu ayuda?
					</Text>

					{isUniversity ? (
						<>
							<Typography variant="body2">
								Como estudiante UATF, tus solicitudes pueden vincularse a tu <strong>carrera y materias</strong> para que tus compañeros de la misma área las vean primero.
							</Typography>
							<Typography variant="body2">
								Puedes usar las opciones avanzadas para elegir facultad, carrera, materia y unidad.
							</Typography>
						</>
					) : (
						<>
							<Typography variant="body2">
								Como invitado o estudiante de colegio, tus ayudas se publican en modo <strong>general</strong>, sin necesidad de elegir facultad ni carrera.
							</Typography>
							<Typography variant="body2">
								Solo describe bien tu duda para que otros puedan ayudarte.
							</Typography>
						</>
					)}
				</SmartBox>

				{/* Alcance de la ayuda: sólo tiene sentido elegir si es universitario */}
				{isUniversity && (
					<>
						<Typography variant="body2" sx={{ mt: 1 }}>
							¿Dónde quieres publicar tu ayuda?
						</Typography>
						<RadioGroup
							value={scope}
							onChange={(_, v) => setScope(v as HelpScope)}
							row
						>
							<FormControlLabel
								value="career"
								control={<Radio size="small" />}
								label="En mi carrera"
							/>
							<FormControlLabel
								value="general"
								control={<Radio size="small" />}
								label="Modo general"
							/>
						</RadioGroup>

						<Divider />
					</>
				)}

				<RadioGroup
					value={requestType}
					onChange={(_, v)=>setType(v as RequestType)}
					row
				>
					<FormControlLabel value="concept_question" control={<Radio size="small"/>} label="Pregunta" />
					<FormControlLabel value="need_notes"        control={<Radio size="small"/>} label="Apuntes" />
					<FormControlLabel value="need_exam"         control={<Radio size="small"/>} label="Examen" />
					<FormControlLabel value="need_assignment"   control={<Radio size="small"/>} label="Tarea" />
				</RadioGroup>

				<Divider/>

				{/* Opciones avanzadas solo tienen sentido cuando el alcance es por carrera */}
				{scope === 'career' && (
					<>
						<Box display="flex" alignItems="center" justifyContent="space-between">
							<Typography variant="body2">
								Opciones avanzadas (facultad, carrera, materia, unidad)
							</Typography>
							<Switch
								checked={advancedMode}
								onChange={handleToggleAdvanced}
								size="small"
							/>
						</Box>

						{advancedMode && (
							<>
								<CascadingSelector value={meta} onChange={handleMetaChange} />
								{errors.meta && (
									<Typography variant="caption" color="error">
										{errors.meta}
									</Typography>
								)}
								<Divider />
							</>
						)}
					</>
				)}

				<MainInput
					label="Título / tema"
					placeholder="Ej: Método de Gauss-Seidel"
					value={topic}
					onChange={handleTopicChange}
					error={errors.topic}
				/>

				<MainInput
					label="Descripción"
					placeholder="Describe brevemente tu duda o lo que buscas…"
					multiline
					rows={4}
					value={description}
					onChange={handleDescChange}
					error={errors.description}
				/>

				<FileButton onChange={e=>e.target.files && setFile(e.target.files[0])} />

				{loading && (
					<Box sx={{ my: 1 }}>
						<LinearProgress />
						<Typography variant="caption">Verificando contenido…</Typography>
					</Box>
				)}

				<FilledButton
					type="submit"
					colorType="primary"
					fullWidth
					disabled={loading}
				>
					{mode === 'edit'
						? (loading ? 'Guardando…' : 'Actualizar ayuda')
						: (loading ? 'Verificando…' : 'Publicar ayuda')}
				</FilledButton>
			</SmartBox>
		</form>
	);
};

export default CreateHelpForm;

