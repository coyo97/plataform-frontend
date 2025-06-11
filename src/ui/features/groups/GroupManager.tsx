import React, { useState, useEffect } from "react";
import {
	Box, Button, TextField, Typography, List, ListItem
} from "@mui/material";
import { styled } from "@mui/system";

import {
	listGroups,
	createGroup,
	joinGroup,
} from "../../../async/services/groupService";
import { Group } from "../../../types/types";

/* ---------- estilos ---------- */
const GroupContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	maxWidth: 600,
	margin: "auto",
}));

const StyledInput = styled(TextField)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	width: "100%",
}));

const GroupList = styled(List)(({ theme }) => ({
	marginTop: theme.spacing(2),
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
}));

const GroupItem = styled(ListItem)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	padding: theme.spacing(2),
	borderBottom: `1px solid ${theme.palette.divider}`,
	"&:last-child": { borderBottom: "none" },
}));

/* ---------- componente ---------- */
const GroupManager: React.FC = () => {
	const [groups, setGroups]     = useState<Group[]>([]);
	const [groupName, setGroupName] = useState("");
	const [description, setDescription] = useState("");

	/* cargar lista inicial */
	useEffect(() => { listGroups().then(setGroups); }, []);

	/* crear grupo */
	const handleCreate = async () => {
		try {
			const { group } = await createGroup(groupName, description);
			setGroups(prev => [...prev, group]);
			setGroupName(""); setDescription("");
		} catch (err) {
			console.error("Error creando grupo:", err);
		}
	};

	/* unirse */
	const handleJoin = async (id: string) => {
		try { await joinGroup(id); }
		catch (err) { console.error("Error al unirse:", err); }
	};

	return (
		<GroupContainer>
			<Typography variant="h4" gutterBottom>Gestión de Grupos</Typography>

			<StyledInput
				label="Nombre del grupo"
				value={groupName}
				onChange={e => setGroupName(e.target.value)}
			/>
			<StyledInput
				label="Descripción del grupo"
				value={description}
				onChange={e => setDescription(e.target.value)}
			/>
			<Button
				fullWidth
				variant="contained"
				onClick={handleCreate}
				sx={{ mb: 3 }}
				disabled={!groupName.trim()}
			>
				Crear Grupo
			</Button>

			<GroupList>
				{groups.map(g => (
					<GroupItem key={g._id}>
						<Typography>{g.name}</Typography>
						<Button variant="outlined" onClick={() => handleJoin(g._id)}>
							Unirse
						</Button>
					</GroupItem>
				))}
			</GroupList>
		</GroupContainer>
	);
};

export default GroupManager;

