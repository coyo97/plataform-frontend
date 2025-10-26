// src/ui/features/stream/organisms/StreamCreateForm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { list as fetchCareers } from '../../../../async/services/careerService';
import { create as createStream } from '../../../../async/services/streamService';
import Text from '../../../shared/atoms/typography/Text';
import { Box, Paper } from '@mui/material';

import SmartBox from '../../../shared/atoms/box/SmartBox';
import TextField from '../../../shared/atoms/textFields/TextField';
import RadioGroup from '../../../shared/atoms/RadioGroup/RadioGroup';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../../shared/atoms/buttons/ghostButton/GhostButton';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import IconButton from '../../../shared/atoms/buttons/iconButton/IconButton';
import CareerCombobox from '../../../shared/molecules/selector/CareerCombobox';

import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import type { Career } from '../../../../types/publication';
import mq from '../../../../config/mq';

/* ====== Reglas ====== */
type Visibility = 'university' | 'career' | 'private';
const MIN_TITLE = 10;
const MIN_DESC  = 20;
const CODE_MIN  = 6;
const CODE_MAX  = 12;
const CODE_RE   = /^[A-Za-z0-9]+$/;

const validateTitle = (v: string) =>
	v.trim().length >= MIN_TITLE ? '' : `Mínimo ${MIN_TITLE} caracteres.`;
const validateDesc = (v: string) =>
	v.trim().length >= MIN_DESC ? '' : `Mínimo ${MIN_DESC} caracteres.`;
const validateCode = (v: string) => {
	if (!v) return 'Requerido.';
	if (v.length < CODE_MIN) return `Mínimo ${CODE_MIN} caracteres.`;
	if (v.length > CODE_MAX) return `Máximo ${CODE_MAX} caracteres.`;
	if (!CODE_RE.test(v))    return 'Solo letras y números (A–Z, a–z, 0–9).';
	return '';
};

interface Props {
	onStreamCreated: (id: string, accessCode?: string, stream?: any) => void;
}

const StreamCreateForm: React.FC<Props> = ({ onStreamCreated }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [visibility, setVisibility] = useState<Visibility>('university');

	const [careers, setCareers] = useState<Career[]>([]);
	const [careerId, setCareerId] = useState<string | null>(null);

	const [accessCode, setAccessCode] = useState('');
	const [loading, setLoading] = useState(false);

	const [touched, setTouched] = useState<{ title: boolean; desc: boolean; code: boolean }>({
		title: false,
		desc: false,
		code: false,
	});

	useEffect(() => {
		fetchCareers().then(setCareers).catch(console.error);
	}, []);

	/* ====== Errores visibles ====== */
	const titleError = useMemo(() => (touched.title ? validateTitle(title) : ''), [title, touched.title]);
	const descError  = useMemo(() => (touched.desc  ? validateDesc(description) : ''), [description, touched.desc]);
	const codeError  = useMemo(() => {
		if (visibility !== 'private') return '';
		return touched.code ? validateCode(accessCode) : '';
	}, [visibility, accessCode, touched.code]);

	const isCareerValid = visibility !== 'career' || !!careerId;
	const isCodeValid   = visibility !== 'private' || !validateCode(accessCode);

	const isFormValid =
		!validateTitle(title) &&
		!validateDesc(description) &&
		isCareerValid &&
		isCodeValid;

	/* ====== Handlers ====== */
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(accessCode);
			// aquí podrías lanzar un toast “Código copiado”
		} catch (e) {
			console.error('No se pudo copiar el código:', e);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setTouched({ title: true, desc: true, code: true });
		if (!isFormValid) return;

		setLoading(true);
		const payload: any = { title, description, visibility };
		if (visibility === 'career' && careerId) payload.careerIds = [careerId];
		if (visibility === 'private') payload.accessCode = accessCode;

		try {
			const res = await createStream(payload);
			localStorage.setItem('activeStreamId', res.stream._id);
			localStorage.setItem('isStreamer', 'true');
			if (res.accessCode) {
				localStorage.setItem('accessCode', res.accessCode);
				setAccessCode(res.accessCode);
			}
			onStreamCreated(res.stream._id, res.accessCode ?? accessCode, res.stream);
		} catch (err) {
			console.error('Error al crear el stream:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleSchedule = () => {
		// Aquí podrías abrir un date-time picker modal
		// Por ahora, deja un placeholder para integrarlo luego
		console.log('Programar stream (abrir date-time picker)');
	};

	const handleSaveDraft = () => {
		// Persistir draft local o API; placeholder
		console.log('Guardar borrador');
	};

	const handleReset = () => {
		setTitle('');
		setDescription('');
		setVisibility('university');
		setCareerId(null);
		setAccessCode('');
		setTouched({ title: false, desc: false, code: false });
	};

	// Limpiar dependientes al cambiar visibilidad
	useEffect(() => {
		if (visibility !== 'career') setCareerId(null);
		if (visibility !== 'private') setAccessCode('');
	}, [visibility]);


	return (
		<form onSubmit={handleSubmit}>
			<SmartBox
				column
				// 24px entre secciones mayores
				sx={{
					width: '100%',
					maxWidth: 560,
					margin: '0 auto',
					rowGap: '1px',
					[mq('md', 'min')]: { maxWidth: 720 },
				}}
			>
				{/* Encabezado */}

				{/* Sección: Información básica (16px entre campos) */}
				<SmartBox column sx={{ rowGap: '1px' }}>
					<TextField
						label="Título del stream"
						value={title}
						onChange={setTitle}
						onBlur={() => setTouched((t) => ({ ...t, title: true }))}
						error={!!titleError}
						helperText={titleError || 'Mínimo 10 caracteres.'}
						counter={`${title.trim().length}/10+`}
					/>

					<TextField
						label="Descripción del stream"
						value={description}
						onChange={setDescription}
						onBlur={() => setTouched((t) => ({ ...t, desc: true }))}
						multiline
						rows={3}
						autoResize
						error={!!descError}
						helperText={descError || 'Mínimo 20 caracteres.'}
						counter={`${description.trim().length}/20+`}
					/>
				</SmartBox>

				{/* Sección: Visibilidad (agrupada en Paper/Card) */}
				<Paper
					elevation={0}
					sx={{
						p: 2,               // ~16px padding interno
						border: '1px solid',
						borderColor: 'divider',
						borderRadius: 2,
					}}
				>
					{/* Título de sección + microcopy (8px entre título y texto) */}
					<Box sx={{ mb: 1 }}>
						<Text as="h4" size="md" weight="bold" colorKey="neutral.black.900">
							Visibilidad
						</Text>
						<Text size="sm" colorKey="neutral.graySoft.700">
							Elige quién puede ver tu stream.
						</Text>
					</Box>

					{/* Control + dependientes (16px entre elementos) */}
					<SmartBox column sx={{ rowGap: '1px' }}>
						<RadioGroup
							legend={undefined} // el título ya está arriba
							value={visibility}
							onChange={(val) => setVisibility(val as Visibility)}
							variant="segmented"
							options={[
								{ value: 'university', label: 'Universidad', icon: <PublicIcon fontSize="small" /> },
								{ value: 'career',     label: 'Carrera',     icon: <SchoolIcon fontSize="small" /> },
								{ value: 'private',    label: 'Privado',     icon: <LockIcon   fontSize="small" /> },
							]}
						/>

						{visibility === 'career' && (
							<CareerCombobox
								careers={careers}
								value={careerId}
								onChange={setCareerId}
								label="Carrera *"
								required
								placeholder="Busca o elige…"
								helperText="Requerido si eliges Visibilidad: Carrera."
								error={!careerId}
								groupByFaculty
							/>
						)}

						{visibility === 'private' && (
							<TextField
								label="Código de acceso"
								value={accessCode}
								onChange={setAccessCode}
								onBlur={() => setTouched((t) => ({ ...t, code: true }))}
								error={!!codeError}
								helperText={codeError || 'Longitud 6–12. Solo alfanumérico.'}
								counter={`${accessCode.length}/6-12`}
								endAdornment={
									<IconButton
										ariaLabel="Copiar código"
										onClick={handleCopy}
										disabled={!accessCode}
										size="small"
									>
										<ContentCopyIcon fontSize="small" />
									</IconButton>
								}
							/>
						)}
					</SmartBox>
				</Paper>

				{/* Pie fijo con acciones (no “cazar” el CTA) */}
				<SmartBox
					row
					gap="px8"
					sx={{
						position: 'sticky',
						bottom: 0,
						zIndex: 1,
						py: '1px',
						background: 'var(--form-footer-bg, #fff)',
						borderTop: '1px solid',
						borderColor: 'divider',
						justifyContent: 'flex-end',
						flexWrap: 'wrap',
						rowGap: '1px',
					}}
				>
					{/* Terciario */}
					<GhostButton
						colorType="secondary"
						type="button"
						label="Restablecer"
						onClick={handleReset}
						disabled={loading}
					/>
					{/* Secundarios */}
					<GhostButton
						colorType="primary"
						type="button"
						label="Programar"
						onClick={handleSchedule}
						disabled={loading}
					/>
					<GhostButton
						colorType="primary"
						type="button"
						label="Guardar borrador"
						onClick={handleSaveDraft}
						disabled={loading}
					/>
					{/* Primario */}
					<FilledButton type="submit" loading={loading} disabled={!isFormValid || loading}>
						Iniciar stream
					</FilledButton>
				</SmartBox>

				{/* feedback de accessCode del backend (si aplica) */}
				{accessCode && visibility !== 'private' && (
					<Text size="sm" colorKey="neutral.graySoft.700">
						Código de acceso generado: <strong>{accessCode}</strong>
					</Text>
				)}
			</SmartBox>
		</form>
	);

};

export default StreamCreateForm;

