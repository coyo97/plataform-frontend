import { BoxProps as MuiBoxProps, SxProps, Theme } from '@mui/material';
import { PaddingKey } from '../../../../Theme/tokens/padding';
import { RadiusKey } from '../../../../Theme/tokens/radius';
import { ShadowKey } from '../../../../Theme/tokens/shadows';

type ResponsiveBoolean = boolean | { [key: string]: boolean };

export interface SmartBoxProps extends MuiBoxProps{
	/** padding basado en tokens (p.md, p.lg…) */
	p?: PaddingKey;
	pt?: PaddingKey; pr?: PaddingKey; pb?: PaddingKey; pl?: PaddingKey;
	/** margin basado en tokens (m.md…) */
	m?: PaddingKey;
	mt?: PaddingKey; mr?: PaddingKey; mb?: PaddingKey; ml?: PaddingKey;
	/** flex helpers */
	row?: ResponsiveBoolean;
	column?: ResponsiveBoolean;
	center ? : boolean;
	between?: boolean;
	/** radius y shadow tokens */
	radius?: RadiusKey;
	shadow?: ShadowKey;
	sx?: SxProps<Theme>;
}

