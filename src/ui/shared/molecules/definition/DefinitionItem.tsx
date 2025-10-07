import React from 'react';
import Text from '../../atoms/typography/Text';
import { Dt, Dd } from './definitionItem.styles';
import type { DefinitionItemProps } from './definitionItem.types';

/** Fila de definición accesible; reutilizable en Perfil, Admin, Streams, etc. */
const DefinitionItem: React.FC<DefinitionItemProps> = ({ label, icon, children }) => (
	<>
		<Dt>
			{icon}
			<Text
				size="sm"
				weight="bold"
				colorKey="text.secondary"
				sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
			>
				{label}
			</Text>
		</Dt>
		<Dd>{children}</Dd>
	</>
);

export default DefinitionItem;

