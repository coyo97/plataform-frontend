import React from 'react';
import { Grid, Typography } from '@mui/material';

import Header from './Header';
import EscudoUATF from '../../../assets/images/Escudo_Universidad_Autónoma_Tomás_Frías.png';

import ChatIcon from '@mui/icons-material/Chat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SchoolIcon from '@mui/icons-material/School';

import {
	Root,
	Content,
	Hero,
	Title,
	SubTitle,
	CTAStack,
	PrimaryBtn,
	SecondaryBtn,
	FeatureGrid,
	FeatureCard,
} from './welcome.styles';

const features = [
	{
		icon: <ChatIcon />,
		title: 'Chat en tiempo real',
		desc: 'Habla con tus compañeros y profesores.',
	},
	{
		icon: <CloudUploadIcon />,
		title: 'Material educativo',
		desc: 'Comparte y descarga apuntes y recursos.',
	},
	{
		icon: <LiveTvIcon />,
		title: 'Streams académicos',
		desc: 'Asiste a clases o tutorías en vivo.',
	},
	{
		icon: <SchoolIcon />,
		title: 'Grupos de estudio',
		desc: 'Crea grupos y colabora en proyectos.',
	},
];

const Welcome: React.FC = () => (
	<Root>
		<Header />

		<Content>
			{/* Logo */}
			<img src={EscudoUATF} alt="Escudo UATF" style={{ width: 150, opacity: 0.85 }} />

			{/* HERO */}
			<Hero>
				<Title variant="h3" as="h1">
					¡Bienvenid@s a la Comunidad&nbsp;UATF!
				</Title>
				<SubTitle variant="h6">
					Conecta, comparte y aprende con estudiantes de toda la universidad
					en un espacio diseñado para el crecimiento académico.
				</SubTitle>

				<CTAStack>
					<PrimaryBtn variant="contained" color="secondary" size="large" href="/register">
						Crear cuenta
					</PrimaryBtn>
					<SecondaryBtn variant="outlined" color="secondary" size="large" href="/login">
						Iniciar sesión
					</SecondaryBtn>
				</CTAStack>
			</Hero>

			{/* FEATURES */}
			<FeatureGrid>
				<Grid container spacing={3} justifyContent="center">
					{features.map(({ icon, title, desc }) => (
						<Grid item xs={12} sm={6} md={3} key={title}>
							<FeatureCard>
								{icon}
								<Typography variant="h6" mt={1}>
									{title}
								</Typography>
								<Typography variant="body2" mt={0.5}>
									{desc}
								</Typography>
							</FeatureCard>
						</Grid>
					))}
				</Grid>
			</FeatureGrid>
		</Content>
	</Root>
);

export default Welcome;

