import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	Container, Title, FormControl, StyledSelect,
	MessageInput, SendButton,
} from "./adminNotifications.styles";
import { MenuItem, Typography, Box, LinearProgress } from "@mui/material";

//import { listUsers } from "../../../async/services/userService";
import { getUsers } from "../../../async/services/roleAssignmentService";
import { sendAdminNotification } from "../../../async/services/notificationService";
import { User } from "../../../types/User";

import FacultyCareerFilter from "../../features/roles/components/FacultyCareerFilter";
import UserMultiPicker from "../../features/roles/components/UserMultiPicker";
import { fetchFaculties, fetchCareers } from "../../../async/services/careerService";

interface Faculty { _id: string; name: string }
interface Career  { _id: string; name: string; facultyId?: string | { _id: string } }

type Mode = "all" | "user" | "filtered";

const AdminNotifications: React.FC = () => {
	// ===== Estado base
	const [message, setMessage] = useState("");
	const [mode, setMode] = useState<Mode>("all");

	// ===== Datos
	const [users, setUsers] = useState<User[]>([]);
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);

	// ===== Cargas
	useEffect(() => {
		getUsers()
		.then(setUsers)
		.catch(console.error);
		Promise.all([
			fetchFaculties().catch(() => [] as Faculty[]),
			fetchCareers().catch(() => [] as Career[]),
		])
		.then(([f, c]) => {
			setFaculties(Array.isArray(f) ? f : []);
			setCareers(Array.isArray(c) ? c : []);
		})
		.catch(console.error);
	}, []);

	// ===== Destino usuario individual
	const [selectedUserId, setSelectedUserId] = useState<string>("");

	// ===== Filtros (idénticos a Roles) para modo "filtered"
	const [facultyId, setFacultyId] = useState<string>("");
	const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>([]);
	const prevFacultyRef = useRef<string>("");

	// ---------- Helpers con TIPOS EXPLÍCITOS ----------
	const normalizedFacultyId = (u: User): string | undefined =>
		typeof (u as any).facultyId === "string"
			? ((u as any).facultyId as string)
			: ((u as any).facultyId?._id as string | undefined);

			function normalizedCareerIds(u: User): string[] {
				const raw = ((u as any).careers ?? []) as Array<string | { _id?: string }>;
				const mapped = raw.map((c) => (typeof c === "string" ? c : (c?._id ?? "")));
				// type guard para evitar 'any'
				return mapped.filter((x): x is string => Boolean(x));
			}

			const careerOptionsForFaculty = useMemo<Career[]>(() => {
				if (!facultyId) return careers;
				return careers.filter((c) => {
					const cf = typeof c.facultyId === "string" ? (c.facultyId as string) : ((c.facultyId as any)?._id as string | undefined);
					return cf === facultyId;
				});
			}, [careers, facultyId]);

			useEffect(() => {
				if (facultyId && prevFacultyRef.current !== facultyId) {
					setSelectedCareerIds(careerOptionsForFaculty.map((c) => c._id));
					prevFacultyRef.current = facultyId;
				}
				if (!facultyId) {
					setSelectedCareerIds([]);
					prevFacultyRef.current = "";
				}
			}, [facultyId, careerOptionsForFaculty]);

			const userBelongsToFaculty = (u: User, facId: string): boolean => {
				const fId = normalizedFacultyId(u);
				if (fId && fId === facId) return true;

				const uCareerIds = normalizedCareerIds(u); // string[]
				if (uCareerIds.length === 0) return false;

				const facultyCareerIds: string[] = careers
				.filter((c) => {
					const cf = typeof c.facultyId === "string" ? (c.facultyId as string) : ((c.facultyId as any)?._id as string | undefined);
					return cf === facId;
				})
				.map((c) => c._id);

				const setFac = new Set(facultyCareerIds);
				return uCareerIds.some((cid: string) => setFac.has(cid)); // <-- cid tipado
			};

			// Usuarios filtrados (misma regla que Roles)
			const filteredUsers = useMemo<User[]>(() => {
				if (!facultyId && selectedCareerIds.length === 0) return users;

				return users.filter((u) => {
					const uCareerIds = normalizedCareerIds(u); // string[]
					const hasCareers = uCareerIds.length > 0;

					if (facultyId) {
						if (!hasCareers) return normalizedFacultyId(u) === facultyId;

						const allowByCareer = uCareerIds.some((cid: string) => selectedCareerIds.includes(cid));
						if (allowByCareer) return true;

						return userBelongsToFaculty(u, facultyId);
					}

					if (selectedCareerIds.length > 0) {
						if (!hasCareers) return false;
						return uCareerIds.some((cid: string) => selectedCareerIds.includes(cid));
					}

					return true;
				});
			}, [users, facultyId, selectedCareerIds, careers]);

			// ===== Selección manual (opcional) dentro de los filtrados
			const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
			const allFilteredIds = useMemo<string[]>(() => filteredUsers.map((u) => u._id), [filteredUsers]);
			const allSelectedInFiltered = useMemo(
				() => allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedUserIds.includes(id)),
				[allFilteredIds, selectedUserIds]
			);
			const someSelectedInFiltered = useMemo(
				() => allFilteredIds.some((id) => selectedUserIds.includes(id)) && !allSelectedInFiltered,
				[allFilteredIds, selectedUserIds, allSelectedInFiltered]
			);

			const handleSelectAllFiltered = () => {
				const set = new Set<string>([...selectedUserIds, ...allFilteredIds]);
				setSelectedUserIds(Array.from(set));
			};
			const handleClearFiltered = () => {
				const cut = new Set<string>(allFilteredIds);
				setSelectedUserIds((prev) => prev.filter((id) => !cut.has(id)));
			};

			// ===== Envío (un solo endpoint; iteramos en frontend cuando es filtrado)
			const [sending, setSending] = useState(false);
			const [progress, setProgress] = useState<{ done: number; total: number; fails: number }>({
				done: 0,
				total: 0,
				fails: 0,
			});

			const handleSend = async () => {
				if (!message.trim()) return;

				try {
					if (mode === "all") {
						await sendAdminNotification({ message, type: "admin", recipients: "all" });
						setMessage("");
						alert("Notificación enviada a todos los usuarios");
						return;
					}

					if (mode === "user") {
						if (!selectedUserId) return;
						await sendAdminNotification({ message, type: "admin", recipients: selectedUserId });
						setMessage("");
						alert("Notificación enviada al usuario seleccionado");
						return;
					}

					// mode === "filtered"
					const targetIds = selectedUserIds.length > 0 ? selectedUserIds : allFilteredIds;
					if (targetIds.length === 0) {
						alert("No hay usuarios filtrados para enviar.");
						return;
					}

					setSending(true);
					setProgress({ done: 0, total: targetIds.length, fails: 0 });

					let done = 0,
					fails = 0;
					const batchSize = 25;
					for (let i = 0; i < targetIds.length; i += batchSize) {
						const slice = targetIds.slice(i, i + batchSize);
						const results = await Promise.allSettled(
							slice.map((id) => sendAdminNotification({ message, type: "admin", recipients: id }))
						);
						results.forEach((r) => (r.status === "fulfilled" ? done++ : fails++));
						setProgress((p) => ({ ...p, done, fails }));
					}

					setMessage("");
					setSelectedUserIds([]);
					alert(`Envío completado: ${done}/${targetIds.length} · errores: ${fails}`);
				} catch (err) {
					console.error("Error enviando notificación:", err);
					alert("Error al enviar notificaciones");
				} finally {
					setSending(false);
				}
			};

			return (
				<Container>
					<Title>Enviar Notificación</Title>

					{/* Selector de modo destino (igual UX que tu select original) */}
					<FormControl>
						<Typography variant="body1">Enviar a:</Typography>
						<StyledSelect
							value={mode === "all" ? "all" : mode === "user" ? (selectedUserId || "user") : "filtered"}
							onChange={(e) => {
								const v = e.target.value as string;
								if (v === "all") setMode("all");
								else if (v === "filtered") setMode("filtered");
								else {
									setMode("user");
									if (v !== "user") setSelectedUserId(v); // un usuario del listado
								}
							}}
						>
							<MenuItem value="all">Todos los usuarios</MenuItem>
							<MenuItem value="filtered">Usuarios filtrados por Facultad/Carrera</MenuItem>
							<MenuItem value="user" disabled>
								— Un usuario —
							</MenuItem>
							{users.map((u) => (
								<MenuItem key={u._id} value={u._id}>
									{u.username}
								</MenuItem>
							))}
						</StyledSelect>
					</FormControl>

					{/* Filtros + selección múltiple (solo en modo filtrado) */}
					{mode === "filtered" && (
						<>
							<FormControl>
								<Typography variant="body2" sx={{ mb: 1 }}>
									Filtra por Facultad o Carreras. Envía a todos los filtrados o selecciona solo algunos.
								</Typography>
								<Box sx={{ p: 1, borderRadius: 2, border: "1px solid rgba(0,0,0,0.08)" }}>
									<FacultyCareerFilter
										faculties={faculties}
										careers={careers}
										facultyId={facultyId}
										selectedCareerIds={selectedCareerIds}
										careerOptionsForFaculty={careerOptionsForFaculty}
										onFacultyChange={(id) => setFacultyId(id)}
										onCareersChange={(ids) => setSelectedCareerIds(ids)}
										onSelectAllCareers={() => setSelectedCareerIds(careerOptionsForFaculty.map((c) => c._id))}
										onClearCareers={() => setSelectedCareerIds([])}
									/>
								</Box>
							</FormControl>

							<FormControl>
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
									<Typography variant="body2">
										Filtrados: {allFilteredIds.length} · Seleccionados: {selectedUserIds.length}
									</Typography>
									<Box sx={{ display: "flex", gap: 1 }}>
										<SendButton
											variant="outlined"
											onClick={handleSelectAllFiltered}
											disabled={allFilteredIds.length === 0}
										>
											{allSelectedInFiltered
												? "Todos (filtrados) ya seleccionados"
												: someSelectedInFiltered
													? "Completar selección (filtrados)"
													: "Seleccionar todos (filtrados)"}
										</SendButton>
										<SendButton
											variant="outlined"
											onClick={handleClearFiltered}
											disabled={allFilteredIds.length === 0 || (!someSelectedInFiltered && !allSelectedInFiltered)}
										>
											Quitar selección (filtrados)
										</SendButton>
									</Box>
								</Box>

								<UserMultiPicker users={filteredUsers as any} valueIds={selectedUserIds} onChangeIds={setSelectedUserIds} />
							</FormControl>
						</>
					)}

					{/* Mensaje */}
					<FormControl>
						<MessageInput
							label="Mensaje"
							multiline
							rows={4}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
					</FormControl>

					{/* Progreso (modo filtrado) */}
					{sending && (
						<Box sx={{ mb: 1 }}>
							<LinearProgress />
							<Typography variant="caption" color="text.secondary">
								Progreso: {progress.done}/{progress.total} · errores: {progress.fails}
							</Typography>
						</Box>
					)}

					<SendButton
						variant="contained"
						onClick={handleSend}
						disabled={sending || !message.trim() || (mode === "user" && !selectedUserId)}
					>
						{mode === "filtered"
							? selectedUserIds.length > 0
								? "Enviar a seleccionados"
								: "Enviar a todos los filtrados"
								: "Enviar"}
					</SendButton>
				</Container>
			);
};

export default AdminNotifications;

