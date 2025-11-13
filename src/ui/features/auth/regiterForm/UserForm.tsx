// src/ui/features/auth/regiterForm/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	FormWrapper,
	FormTitle,
	FormInput,
	SubmitButton,
	FormLabel,
} from './formResgiter.styles';

import { fetchCareers } from '../../../../async/services/careerService';
import { registerUser } from '../../../../async/services/authService';

// grillas
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import GridColumn from '../../../shared/atoms/grid/GridColumn';

import {
	validateEmail,
	validatePassword,
	validateForm,
	createNameValidator,
	createOptionalNameLikeValidator,
} from '../../../shared/utils/validation/validators';

import { Alert } from '@mui/material';

interface Career {
	_id: string;
	name: string;
}

type AccountType = 'guest' | 'university';

interface UserFormValues {
	username: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	email: string;
	password: string;
	accountType: AccountType;
	schoolName: string;
	careerId: string; // solo se usa si accountType === 'university'
}

const UserForm: React.FC = () => {
	const [values, setValues] = useState<UserFormValues>({
		username: '',
		apellidoPaterno: '',
		apellidoMaterno: '',
		email: '',
		password: '',
		accountType: 'guest',
		schoolName: '',
		careerId: '',
	});

	const [availableCareers, setAvailableCareers] = useState<Career[]>([]);

	const [successMessage, setSuccessMessage] = useState('');
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof UserFormValues, string>>
	>({});

	const navigate = useNavigate();

	useEffect(() => {
		const loadCareers = async () => {
			try {
				const data = await fetchCareers();
				setAvailableCareers(data);
			} catch (err) {
				console.warn('Error al obtener carreras');
				setError('Error al obtener carreras. Intenta más tarde.');
			}
		};
		loadCareers();
	}, []);

	const isUniversity = values.accountType === 'university';

	const handleChange =
		<K extends keyof UserFormValues>(field: K) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const value =
				e.target.type === 'checkbox'
					? (e.target as HTMLInputElement).checked
					: e.target.value;

			setValues((prev) => ({
				...prev,
				[field]: value as UserFormValues[K],
			}));

			// si cambia el tipo de cuenta a guest, limpiamos carrera
			if (field === 'accountType' && value === 'guest') {
				setValues((prev) => ({
					...prev,
					accountType: 'guest',
					careerId: '',
				}));
			}

			setFieldErrors((prev) => ({
				...prev,
				[field]: undefined,
			}));

			// limpiamos error general
			setError('');
		};

	// ---- Mapeo de errores de registro ----
	const mapRegisterError = (err: any): string => {
		const status = err?.status;
		const msg = (err?.message || '').toLowerCase();

		// email ya registrado / duplicado
		if (status === 409 || msg.includes('ya existe') || msg.includes('registrado')) {
			return 'Ya existe una cuenta registrada con este email.';
		}

		// validación de datos
		if (status === 400) {
			return err?.message || 'Datos inválidos. Revisa el formulario.';
		}

		if (status === 403) {
			return 'No tienes permisos para crear usuarios. Contacta al administrador.';
		}

		if (status >= 500) {
			return 'El servicio de registro no está disponible en este momento.';
		}

		if (!status) {
			return 'No se pudo conectar con el servidor. Revisa tu conexión.';
		}

		return 'Error al crear usuario. Verifica los datos.';
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError('');
		setSuccessMessage('');

		const { errors, isValid } = validateForm<UserFormValues>(values, {
			username: createNameValidator('Nombre'),
			apellidoPaterno: createNameValidator('Apellido Paterno'),
			apellidoMaterno: createNameValidator('Apellido Materno'),
			email: validateEmail,
			password: validatePassword,
			// opcional: colegio
			schoolName: createOptionalNameLikeValidator('Colegio / Institución', 100),
		});

		const newErrors = { ...errors };

		// Regla adicional de negocio:
		// si es universitario, careerId es obligatorio
		if (values.accountType === 'university' && !values.careerId) {
			newErrors.careerId =
				'Debes seleccionar una carrera para registrarte como universitario.';
		}

		const finalIsValid = Object.values(newErrors).every((e) => !e);

		if (!finalIsValid) {
			setFieldErrors(newErrors);
			return;
		}

		try {
			setSubmitting(true);

			const payload = {
				username: values.username,
				apellidoPaterno: values.apellidoPaterno,
				apellidoMaterno: values.apellidoMaterno,
				email: values.email,
				password: values.password,
				accountType: values.accountType,
				...(values.schoolName ? { schoolName: values.schoolName } : {}),
				careers:
					values.accountType === 'university' && values.careerId
						? [values.careerId]
						: [], // invitados => []
			};

			await registerUser(payload as any);
			setSuccessMessage('Registro exitoso. Redirigiendo al inicio de sesión…');
			setTimeout(() => navigate('/login'), 1200);
		} catch (err: any) {
			console.warn('Error al registrar usuario');
			setError(mapRegisterError(err));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<FormWrapper onSubmit={handleSubmit}>
			<FormTitle>Registro</FormTitle>

			{error && (
				<Alert
					severity="warning"
					onClose={() => setError('')}
					sx={{ width: '100%', mb: 1 }}
				>
					{error}
				</Alert>
			)}

			{successMessage && (
				<Alert
					severity="success"
					onClose={() => setSuccessMessage('')}
					sx={{ width: '100%', mb: 1 }}
				>
					{successMessage}
				</Alert>
			)}

			{/* Tipo de cuenta */}
			<div>
				<FormLabel>Tipo de cuenta:</FormLabel>
				<select
					value={values.accountType}
					onChange={handleChange('accountType')}
					style={{
						padding: '8px 10px',
						borderRadius: '4px',
						border: '1px solid #ddd',
						width: '100%',
						fontSize: '14px',
						boxSizing: 'border-box',
					}}
				>
					<option value="guest">Invitado / Colegial</option>
					<option value="university">Universitario UATF</option>
				</select>
				<p
					style={{
						marginTop: 4,
						fontSize: 11,
						color: '#666',
						lineHeight: 1.4,
					}}
				>
					{isUniversity
						? 'Selecciona tu carrera universitaria para acceder a módulos académicos.'
						: 'Puedes registrarte sin carrera. Ideal para invitados, colegiales.'}
				</p>
			</div>

			{/* DATOS PERSONALES */}
			<div>
				<GridContainer
					variant="mobile"
					columns={{ xxs: 4, md: 8 }} // 1 col en mobile, 2 cols (4+4) en md+
					style={{
						paddingLeft: 0,
						paddingRight: 0,
						margin: 0,
						rowGap: 12,
					}}
				>
					{/* Nombre */}
					<GridColumn span={{ xxs: 4, md: 4 }}>
						<FormLabel>Nombre:</FormLabel>
						<FormInput
							type="text"
							value={values.username}
							onChange={handleChange('username')}
							aria-invalid={!!fieldErrors.username}
						/>
						{fieldErrors.username && (
							<p style={{ color: 'red', fontSize: 11 }}>
								{fieldErrors.username}
							</p>
						)}
					</GridColumn>

					{/* Apellido Paterno */}
					<GridColumn span={{ xxs: 4, md: 4 }}>
						<FormLabel>Apellido Paterno:</FormLabel>
						<FormInput
							type="text"
							value={values.apellidoPaterno}
							onChange={handleChange('apellidoPaterno')}
							aria-invalid={!!fieldErrors.apellidoPaterno}
						/>
						{fieldErrors.apellidoPaterno && (
							<p style={{ color: 'red', fontSize: 11 }}>
								{fieldErrors.apellidoPaterno}
							</p>
						)}
					</GridColumn>

					{/* Apellido Materno */}
					<GridColumn span={{ xxs: 4, md: 4 }}>
						<FormLabel>Apellido Materno:</FormLabel>
						<FormInput
							type="text"
							value={values.apellidoMaterno}
							onChange={handleChange('apellidoMaterno')}
							aria-invalid={!!fieldErrors.apellidoMaterno}
						/>
						{fieldErrors.apellidoMaterno && (
							<p style={{ color: 'red', fontSize: 11 }}>
								{fieldErrors.apellidoMaterno}
							</p>
						)}
					</GridColumn>

					{/* Email */}
					<GridColumn span={{ xxs: 4, md: 4 }}>
						<FormLabel>Email:</FormLabel>
						<FormInput
							type="email"
							value={values.email}
							onChange={handleChange('email')}
							aria-invalid={!!fieldErrors.email}
						/>
						{fieldErrors.email && (
							<p style={{ color: 'red', fontSize: 11 }}>
								{fieldErrors.email}
							</p>
						)}
					</GridColumn>
				</GridContainer>
			</div>

			{/* DATOS DE ACCESO */}
			<div>
				<FormLabel>Password:</FormLabel>
				<FormInput
					type="password"
					value={values.password}
					onChange={handleChange('password')}
					aria-invalid={!!fieldErrors.password}
				/>
				{fieldErrors.password && (
					<p style={{ color: 'red', fontSize: 11 }}>
						{fieldErrors.password}
					</p>
				)}
			</div>

			{/* Campo opcional para invitados */}
			{values.accountType === 'guest' && (
				<div>
					<FormLabel>Colegio / Institución (opcional):</FormLabel>
					<FormInput
						type="text"
						value={values.schoolName}
						onChange={handleChange('schoolName')}
						placeholder="Ej. Colegio Nacional Potosí"
						aria-invalid={!!fieldErrors.schoolName}
					/>
					{fieldErrors.schoolName && (
						<p style={{ color: 'red', fontSize: 11 }}>
							{fieldErrors.schoolName}
						</p>
					)}
				</div>
			)}

			{/* Carrera: visible y requerido solo si Universitario */}
			{isUniversity && (
				<div>
					<FormLabel>Carrera:</FormLabel>
					<select
						value={values.careerId}
						onChange={handleChange('careerId')}
						style={{
							padding: '8px 10px',
							borderRadius: '4px',
							border: '1px solid #ddd',
							width: '100%',
							fontSize: '14px',
							boxSizing: 'border-box',
						}}
					>
						<option value="" disabled>
							Seleccione una carrera
						</option>
						{availableCareers.map((career) => (
							<option key={career._id} value={career._id}>
								{career.name}
							</option>
						))}
					</select>
					{fieldErrors.careerId && (
						<p style={{ color: 'red', fontSize: 11 }}>
							{fieldErrors.careerId}
						</p>
					)}
				</div>
			)}

			<SubmitButton type="submit" disabled={submitting}>
				{submitting ? 'Registrando…' : 'Registro'}
			</SubmitButton>
			<SubmitButton type="button" onClick={() => navigate('/login')}>
				Iniciar Sesión
			</SubmitButton>
		</FormWrapper>
	);
};

export default UserForm;

