// ui/features/profile/moleculas/ProfileInfo/ProfileInfo.tsx
import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import SmartBox from '../../../../shared/atoms/box/SmartBox';
import Text from '../../../../shared/atoms/typography/Text';
import type { UserProfile } from '../../../../../types/profile';

import DefinitionItem from '../../../../shared/molecules/definition/DefinitionItem';
import TagChips from '../../../../shared/molecules/tags/TagChips';
import MetaBadgesRow from '../../../../shared/molecules/meta/MetaBadgesRow';
import { normalizeTags } from '../../../../shared/utils/tags/normalizeTags';
import { formatDateEs } from '../../../../shared/utils/date/formatDateEs';

import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';           // Nombre
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';         // Carrera / Facultad
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';           // Correo
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';             // Bio
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'; // Intereses

interface Props {
	data: UserProfile;
	showEmail?: boolean;
	interestsMax?: number;
}

/** Mapeo específico del dominio Perfil (puede promoverse a shared/domain si Admin comparte exactamente la misma taxonomía). */
const statusToBadge = (status?: string) => {
	const s = (status ?? '').toLowerCase();
	if (['active', 'activo', 'enabled', 'enable'].includes(s)) {
		return { label: 'Activo', color: 'success' as const, variant: 'soft' as const };
	}
	if (['inactive', 'inactivo', 'disabled', 'disable'].includes(s)) {
		return { label: 'Inactivo', color: 'warning' as const, variant: 'soft' as const };
	}
	if (['banned', 'blocked', 'bloqueado', 'suspendido', 'blacklist'].includes(s)) {
		return { label: 'Restringido', color: 'error' as const, variant: 'soft' as const };
	}
	if (!s) return undefined;
	// Estado desconocido → info
	const label = s.charAt(0).toUpperCase() + s.slice(1);
	return { label, color: 'info' as const, variant: 'soft' as const };
};

// Helpers
const unique = (arr: (string | undefined)[]) =>
	Array.from(new Set(arr.filter(Boolean))) as string[];

const collectFacultyNames = (
	careers?: { faculty?: { name?: string } }[],
	fallbackFacultyName?: string,
) => {
	const fromCareers = unique((careers ?? []).map(c => c?.faculty?.name));
	return unique([...fromCareers, fallbackFacultyName]);
};

const ProfileInfo: React.FC<Props> = ({ data, showEmail = false, interestsMax = 8 }) => {
	const theme = useTheme();

	const fullName = useMemo(
		() =>
			`${data.username ?? ''} ${data.apellidoPaterno ?? ''} ${data.apellidoMaterno ?? ''}`
		.replace(/\s+/g, ' ')
		.trim(),
		[data.username, data.apellidoPaterno, data.apellidoMaterno]
	);

	// Carreras
	const careers = useMemo(
		() => data.careers?.map(c => c?.name).filter(Boolean) as string[] | undefined,
		[data.careers]
	);
	const careerNames = careers?.length ? careers.join(', ') : 'No asignada todavía';

	// Facultades (múltiples si aplica). También aceptamos un faculty “root” si lo trajeras así.
	const facultyNames = useMemo(
		() =>
			collectFacultyNames(
				data.careers as unknown as { faculty?: { name?: string } }[] | undefined,
				(data as any)?.faculty?.name // fallback opcional
		),
		[data.careers, (data as any)?.faculty?.name]
	);
	const facultyText = facultyNames.length ? facultyNames.join(', ') : 'No asignada todavía';

	// Meta
	const memberSince =
		formatDateEs((data as any)?.createdAt ?? (data as any)?.registeredAt, 'absolute') || undefined;

	const statusBadge = statusToBadge((data as any)?.status);

	// Contenido
	const bio =
		data.bio && data.bio.trim().length > 0 ? data.bio : 'Sin biografía por ahora';

	const interestsList = normalizeTags(data.interests);
	const hasInterests = interestsList.length > 0;

	// Meta badges (dejamos estado y antigüedad; la facultad ya la mostramos como DefinitionItem)
	const metaItems = [
		...(statusBadge ? [statusBadge] : []),
		...(memberSince ? [{ label: `Miembro desde: ${memberSince}`, color: 'primary' as const, variant: 'soft' as const }] : []),
	];

	return (
		<SmartBox column sx={{ gap: theme.spacing(2), width: '100%' }} center>
			{metaItems.length > 0 && (
				<MetaBadgesRow items={metaItems} />
			)}

			<Box
				component="dl"
				sx={{
					display: 'grid',
					gridTemplateColumns: '1fr',
					rowGap: theme.spacing(1),
					columnGap: theme.spacing(2),
					[theme.breakpoints.up('md')]: {
						gridTemplateColumns: '220px 1fr',
						alignItems: 'start',
				},
				}}
			>

				{/* Facultad */}
				<DefinitionItem
					label="Facultad"
					icon={<SchoolOutlinedIcon fontSize="small" aria-hidden />}
				>
					<Text>{facultyText}</Text>
				</DefinitionItem>

				{/* Carreras */}
				<DefinitionItem
					label="Carrera"
					icon={<SchoolOutlinedIcon fontSize="small" aria-hidden />}
				>
					<Text>{careerNames}</Text>
				</DefinitionItem>

				{/* Correo (opcional) */}
				{showEmail && data.email && (
					<DefinitionItem
						label="Correo"
						icon={<EmailOutlinedIcon fontSize="small" aria-hidden />}
					>
						<Text as="a" href={`mailto:${data.email}`} sx={{ textDecoration: 'none' }}>
							{data.email}
						</Text>
					</DefinitionItem>
				)}

				{/* Bio */}
				<DefinitionItem
					label="Bio"
					icon={<InfoOutlinedIcon fontSize="small" aria-hidden />}
				>
					<Text as="p" sx={{ lineHeight: 1.65, whiteSpace: 'pre-line' }}>
						{bio}
					</Text>
				</DefinitionItem>

				{/* Intereses */}
				<DefinitionItem
					label="Intereses"
					icon={<LocalOfferOutlinedIcon fontSize="small" aria-hidden />}
				>
					{hasInterests ? (
						<TagChips items={interestsList} maxVisible={interestsMax} />
					) : (
						<Text colorKey="text.secondary">Aún no has añadido intereses</Text>
					)}
				</DefinitionItem>
			</Box>
		</SmartBox>
	);
};

export default ProfileInfo;

