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
import TextEditor   from '../../../shared/atoms/inputs/TextEditor';
import SmartBox     from '../../../shared/atoms/box/SmartBox';
import CascadingSelector from '../../../shared/molecules/CascadingSelector/CascadingSelector';
import ModerationAlert from '../../../shared/molecules/moderation/ModerationAlert';
import { resolveErrorMessage } from '../../../shared/utils/validation/moderationError';
import Text from '../../../shared/atoms/typography/Text';

import { createHelpRequest, updateMyHelp } from '../../../../async/services/academicHelpService';
import { fetchMyCareers } from '../../../../async/services/careerService';
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

	const [myDefaultMetaLoaded, setMyDefaultMetaLoaded] = useState(false);
	const [primaryCareerId, setPrimaryCareerId] = useState<string | null>(null); 

	useEffect(() => {
		if (!isUniversity) {
			setScope('general');
			setAdvancedMode(false);
			setMeta({});
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

	useEffect(() => {
		if (!isUniversity) return;
		if (!advancedMode) return;
		if (scope !== 'career') return;
		if (mode === 'edit') return;
		if (myDefaultMetaLoaded) return;
		if (meta.careerId || meta.facultyId) return;

		let cancelled = false;

		const loadDefaultMeta = async () => {
			try {
				const careers = await fetchMyCareers().catch(() => []) as any[];
				if (!Array.isArray(careers) || careers.length === 0) return;

				const primary = careers[0];
				const careerId = String(primary._id);
				let facultyId: string | undefined;

				const f = primary.facultyId;
				if (typeof f === 'string') facultyId = f;
				else if (f && typeof f === 'object' && f._id) facultyId = f._id;

				if (!cancelled) {
					setMeta(prev => ({
						...prev,
						facultyId: facultyId ?? prev.facultyId,
						careerId : careerId  ?? prev.careerId,
					}));
					setPrimaryCareerId(careerId);       
					setMyDefaultMetaLoaded(true);
				}
			} catch (e) {
				console.error('No se pudo cargar la carrera por defecto para ayuda académica', e);
			}
		};

		loadDefaultMeta();
		return () => { cancelled = true; };
	}, [isUniversity, advancedMode, scope, mode, myDefaultMetaLoaded, meta.careerId, meta.facultyId]);

	useEffect(() => {
		if (!primaryCareerId && meta.careerId && isUniversity && mode === 'create') {
			setPrimaryCareerId(meta.careerId);
		}
	}, [primaryCareerId, meta.careerId, isUniversity, mode]);

	const isOtherCareerSelected =
		isUniversity &&
		scope === 'career' &&
		advancedMode &&
		!!meta.careerId &&
		!!primaryCareerId &&
		meta.careerId !== primaryCareerId;

	const handleScopeChange = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
		const nextScope = value as HelpScope;
		setScope(nextScope);

		if (nextScope === 'general') {
			setAdvancedMode(false);
			setMeta({});
			setErrors(prev => ({ ...prev, meta: undefined }));
		}

		if (nextScope === 'career') {
			setErrors(prev => ({ ...prev, meta: undefined }));
		}
	};

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
			if (advancedMode) {
				Object.entries(meta).forEach(([k, v]) => {
					if (v && String(v).trim()) {
						fd.append(k, v as string);
					}
				});
			}
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
				setMyDefaultMetaLoaded(false);
				setPrimaryCareerId(null);

				if (!isUniversity) {
					setScope('general');
					setAdvancedMode(false);
				} else {
					setScope('career');
					setAdvancedMode(false);
				}
			}
		} catch (err: any) {
			console.error('Error al enviar solicitud de ayuda:', err);

			const backendMsg: string | undefined =
				err?.response?.data?.message ||
				err?.message;

			if (backendMsg && backendMsg.includes('No se pudo determinar la carrera')) {
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
							{!isOtherCareerSelected ? (
								<>
									<Typography variant="body2">
										Como estudiante UATF, tus solicitudes se publican por defecto en tu{' '}
										<strong>carrera principal</strong>. Puedes usar las opciones avanzadas para
										elegir otra carrera o materia.
									</Typography>
									<Typography variant="body2">
										Si necesitas publicar para otra carrera (por ejemplo Matemáticas), activa las
										opciones avanzadas y selecciona la carrera y materia correspondientes.
									</Typography>
								</>
							) : (
								<>
									<Typography variant="body2">
										Esta solicitud se publicará en la <strong>carrera seleccionada en las opciones avanzadas</strong>,
										no necesariamente en tu carrera principal.
									</Typography>
									<Typography variant="body2">
										Siempre puedes volver a tu carrera principal deshaciendo el cambio en la carrera
										seleccionada o usando el modo general.
									</Typography>
								</>
							)}
						</>
					) : (
						<>
							<Typography variant="body2">
								Como invitado o estudiante de colegio, tus ayudas se publican en modo <strong>general</strong>,
								sin necesidad de elegir facultad ni carrera.
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
							onChange={handleScopeChange}
							row
						>
							<FormControlLabel
								value="career"
								control={<Radio size="small" />}
								// 👇 cambiamos el label según si usa su carrera o otra
								label={isOtherCareerSelected ? 'En una carrera específica' : 'En mi carrera'}
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

				<TextEditor
					label="Descripción"
					placeholder="Describe brevemente tu duda, qué has intentado y qué necesitas…"
					value={description}
					onChange={handleDescChange}
					hint="Puedes usar negritas, cursivas y listas para organizar mejor la explicación."
					minHeight={140}
					toolbarOptions={{
						bold: true,
						italic: true,
						underline: true,
						bulletList: true,
						orderedList: true,
					}}
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

