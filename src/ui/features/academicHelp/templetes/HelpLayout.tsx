// ui/features/academicHelp/templetes/HelpLayout.tsx
import React from 'react';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import GridColumn from '../../../shared/atoms/grid/GridColumn';

type Props = {
	children: React.ReactNode;
};

const HelpLayout: React.FC<Props> = ({ children }) => {
	const arrayChildren = React.Children.toArray(children);
	const hasExtra = arrayChildren.length > 1;

	return (
		<GridContainer
			variant="desktopFixed"
			columns={{
				xxs: 4,   // mobile base (match sistema móvil)
				sm: 6,
				md: 12,
			}}
			style={{
				paddingTop: 16,
				paddingBottom: 24,
			}}
		>
			{/* Columna principal (contenido de la ayuda) */}
			<GridColumn
				span={{
					xxs: 4, // en mobile ocupa todo el ancho
					sm: 6, // en tablet ocupa casi todo
					md: hasExtra ? 8 : 10, // si hay sidebar, 8/12; si no, más ancho
					lg: hasExtra ? 8 : 10,
				}}
				self={{
					xxs: 'stretch',
					md: 'center',
				}}
				style={{ width: '100%' }}
			>
				{arrayChildren[0]}
			</GridColumn>

			{/* Columna extra (futuro sidebar / info adicional) */}
			{hasExtra && (
				<GridColumn
					span={{
						xxs: 4, // en mobile baja debajo del contenido
						sm: 6,
						md: 4, // en desktop actúa como sidebar
						lg: 4,
					}}
				>
					{arrayChildren.slice(1)}
				</GridColumn>
			)}
		</GridContainer>
	);
};

export default HelpLayout;

