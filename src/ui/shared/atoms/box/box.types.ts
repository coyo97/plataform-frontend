import { BoxProps } from '@mui/material/Box';
import { PaddingKey } from '../../../../Theme/tokens/padding';
import { RadiusKey } from '../../../../Theme/tokens/radius';
import { ShadowKey } from '../../../../Theme/tokens/shadows';

export interface SmartBoxProps extends BoxProps {
	/** padding basado en tokens (p.md, p.lg…) */
	p?: PaddingKey;
	pt?: PaddingKey; pr?: PaddingKey; pb?: PaddingKey; pl?: PaddingKey;
	/** margin basado en tokens (m.md…) */
	m?: PaddingKey;
	mt?: PaddingKey; mr?: PaddingKey; mb?: PaddingKey; ml?: PaddingKey;
	/** flex helpers */
	row?   : boolean;
	column?: boolean;
	center ? : boolean;
	between?: boolean;
	/** radius y shadow tokens */
	radius?: RadiusKey;
	shadow?: ShadowKey;
}

