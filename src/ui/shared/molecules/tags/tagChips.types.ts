export type GetHref = (tag: string) => string | undefined;

export interface TagChipsProps {
	items: string[];
	maxVisible?: number;
	/** Genera href opcional para cada tag; si no hay href, se renderiza como chip plano */
	getHref?: GetHref;
	/** Para enlaces externos, agrega target/_blank y rel seguro */
	externalLinks?: boolean;
	className?: string;
}

