import React, { useState, useEffect } from "react";
import {
	Container, Title, FormControl, StyledSelect,
	MessageInput, SendButton,
} from "./adminNotifications.styles";
import { MenuItem, Typography } from "@mui/material";

import { listUsers } from "../../../async/services/userService";
import { sendAdminNotification } from "../../../async/services/notificationService";
import { User } from "../../../types/User";

const AdminNotifications: React.FC = () => {
	const [message, setMessage]     = useState("");
	const [recipients, setRecipients] = useState<string>("all");
	const [users, setUsers]         = useState<User[]>([]);

	/* cargar usuarios */
	useEffect(() => { listUsers().then(setUsers).catch(console.error); }, []);

	const handleSend = async () => {
		try {
			await sendAdminNotification({
				message,
				type: "admin",
				recipients,
			});
			setMessage("");
			alert(`Notificación enviada a ${
				recipients === "all" ? "todos los usuarios" : "el usuario seleccionado"
			}`);
		} catch (err) { console.error("Error enviando notificación:", err); }
	};

	return (
		<Container>
			<Title>Enviar Notificación</Title>

			<FormControl>
				<Typography variant="body1">Enviar a:</Typography>
				<StyledSelect
					value={recipients}
					onChange={e => setRecipients(e.target.value as string)}
				>
					<MenuItem value="all">Todos los usuarios</MenuItem>
					{users.map(u => (
						<MenuItem key={u._id} value={u._id}>{u.username}</MenuItem>
					))}
				</StyledSelect>
			</FormControl>

			<FormControl>
				<MessageInput
					label="Mensaje"
					multiline
					rows={4}
					value={message}
					onChange={e => setMessage(e.target.value)}
				/>
			</FormControl>

			<SendButton variant="contained" onClick={handleSend}>Enviar</SendButton>
		</Container>
	);
};

export default AdminNotifications;

