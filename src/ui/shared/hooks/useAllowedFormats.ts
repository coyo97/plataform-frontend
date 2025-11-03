// src/ui/shared/hooks/useAllowedFormats.ts
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

type FileFormat = { _id: string; mimeType: string; description?: string; enabled: boolean };

const MIME_TO_EXT: Record<string, string[]> = {
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'image/webp': ['.webp'],
	// si el admin agrega más, puedes extender este mapa
	// 'image/avif': ['.avif'],
};

export function useAllowedFormats() {
	const { HOST, SERVICE } = getEnvVariables();
	const [formats, setFormats] = useState<FileFormat[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const token = localStorage.getItem('token');
				const resp = await axios.get(`${HOST}${SERVICE}/file-formats`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!mounted) return;
				setFormats(resp.data?.formats ?? []);
			} catch (e: any) {
				if (!mounted) return;
				setError(e?.message || 'No se pudieron cargar los formatos');
				setFormats([]);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [HOST, SERVICE]);

	const enabled = useMemo(() => formats.filter(f => f.enabled), [formats]);

	// Solo imágenes habilitadas para el módulo Perfil
	const enabledImages = useMemo(
		() => enabled.filter(f => f.mimeType.startsWith('image/')),
		[enabled]
	);

	const allowedImageMimes = useMemo(
		() => enabledImages.map(f => f.mimeType),
		[enabledImages]
	);

	// Construimos string para <input accept>, desde MIME_TO_EXT si lo conocemos; si no, usa `image/*` como fallback.
	const imageAccept = useMemo(() => {
		const exts: string[] = [];
		for (const mime of allowedImageMimes) {
			const mapped = MIME_TO_EXT[mime];
			if (mapped && mapped.length) exts.push(...mapped);
		}
		// si no tenemos mapeo de extensiones, evita bloquear el selector y permite image/*
		if (exts.length === 0) return 'image/*';
		return Array.from(new Set(exts)).join(',');
	}, [allowedImageMimes]);

	// Texto legible para UI (usa descriptions si existen; si no, el mime)
	const imageFormatsLabel = useMemo(() => {
		if (enabledImages.length === 0) return 'Sin formatos de imagen habilitados';
		const items = enabledImages.map(f => f.description?.trim() || f.mimeType);
		// quita duplicados
		return Array.from(new Set(items)).join(', ');
	}, [enabledImages]);

	// Validador para imágenes (perfil)
	const validateProfileImage = (file: File): string | null => {
		// si no hay nada configurado, deja pasar solo image/* para no bloquear (opcional)
		if (allowedImageMimes.length === 0) {
			if (!file.type.startsWith('image/')) {
				return 'Formato no permitido. Solo imágenes.';
			}
			return null;
		}
		if (!allowedImageMimes.includes(file.type)) {
			return `Formato no permitido. Formatos válidos: ${imageFormatsLabel}.`;
		}
		return null;
	};

	return {
		loading,
		error,
		// crudos por si los quieres en otros módulos:
		allEnabled: enabled,
		allowedImageMimes,
		imageAccept,
		imageFormatsLabel,
		validateProfileImage,
	};
}

