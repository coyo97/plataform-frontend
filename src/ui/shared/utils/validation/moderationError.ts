// src/ui/shared/utils/validation/moderationError.ts

const MODERATION_REGEX =
	/moderaci[oó]n|toxicity|lenguaje inapropiado|contenido inapropiado|inapropiado/i;

const FILE_TYPE_REGEX =
	/tipo de archivo no permitido|file type not allowed|unsupported file type/i;

const FILE_SIZE_REGEX =
	/límite de tamaño|file too large|max size|tamaño máximo/i;

export type CommonErrorKey = 'moderation' | 'fileType' | 'fileSize' | 'generic';

export function getCommonErrorKey(err: unknown): CommonErrorKey {
	const msg = (() => {
		if (!err) return '';
		if (typeof err === 'string') return err;
		const anyErr = err as any;
		if (anyErr?.message) return String(anyErr.message);
		if (anyErr?.toString) return String(anyErr.toString());
		return '';
	})();

	if (MODERATION_REGEX.test(msg)) return 'moderation';
	if (FILE_TYPE_REGEX.test(msg)) return 'fileType';
	if (FILE_SIZE_REGEX.test(msg)) return 'fileSize';

	return 'generic';
}

export function resolveErrorMessage(
	err: unknown,
	messages: {
		generic: string;
		moderation?: string;
		fileType?: string;
		fileSize?: string;
	}
): string {
	const key = getCommonErrorKey(err);

	switch (key) {
		case 'moderation':
			return (
				messages.moderation ??
				messages.generic
			);
		case 'fileType':
			return (
				messages.fileType ??
				messages.generic
			);
		case 'fileSize':
			return (
				messages.fileSize ??
				messages.generic
			);
		default:
			return messages.generic;
	}
}

