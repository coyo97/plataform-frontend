// src/ui/components/reports/ReportManagement.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Snackbar,
	Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Text from "../../shared/atoms/typography/Text";
import SmartBox from "../../shared/atoms/box/SmartBox";
import SectionTitle from "../../shared/atoms/titles/SectionTitle";
import TableView from "../../shared/organisms/table/TableView";
import type { ColumnDef, RowAction } from "../../shared/organisms/table/tableView.types";

import { listReports, updateReportStatus, sendReportNotification, } from "../../../async/services/reportService";
import { deletePublication } from "../../../async/services/publicationService";
import { Report } from "../../../types/centerAlert";

const templates = [
	"Publicación inadecuada",
	"Acoso o lenguaje ofensivo",
	"Spam o duplicado",
	"Violación de normas académicas",
	"Otra razón",
];

const ReportManagement: React.FC = () => {
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState("");
	const [customMessage, setCustomMessage] = useState("");
	const [currentReportId, setCurrentReportId] = useState<string | null>(null);
	const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
		open: false,
		message: "",
		severity: "success",
	});

	const navigate = useNavigate();

	// ====== Cargar reportes ======
	const reload = async () => {
		try {
			setLoading(true);
			const data = await listReports();
			setReports(data ?? []);
		} catch (err) {
			console.error("Error al obtener reportes:", err);
			setReports([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		reload();
	}, []);

	// ====== Actualizar estado ======
	const handleUpdate = async (id: string, status: "reviewed" | "dismissed") => {
		try {
			await updateReportStatus(id, status);
			setSnackbar({ open: true, message: "Estado actualizado correctamente", severity: "success" });
		} catch (error) {
			console.error(error);
			setSnackbar({ open: true, message: "Error al actualizar el reporte", severity: "error" });
		} finally {
			await reload();
		}
	};

	// ====== Abrir y cerrar dialogo de alerta ======
	const handleOpenDialog = (reportId: string) => {
		setCurrentReportId(reportId);
		setSelectedTemplate("");
		setCustomMessage("");
		setOpenDialog(true);
	};

	const handleSendAlert = async () => {
		if (!currentReportId) return;
		try {
			const message =
				selectedTemplate === "Otra razón" && customMessage
					? customMessage
					: selectedTemplate || customMessage;

					await sendReportNotification(currentReportId, message);
					setSnackbar({ open: true, message: "Alerta enviada correctamente", severity: "success" });
					setOpenDialog(false);
		} catch (err) {
			console.error("Error al enviar alerta:", err);
			setSnackbar({ open: true, message: "Error al enviar la alerta", severity: "error" });
		}
	};
	const handleDeletePublication = async (report: Report) => {
		const pubId = (report as any)?.target?._id;
		if (!pubId) {
			setSnackbar({ open: true, message: "La publicación ya no existe.", severity: "error" });
			return;
		}
		const ok = window.confirm("¿Eliminar esta publicación de forma permanente?");
		if (!ok) return;

		try {
			await deletePublication(pubId);
			// (Opcional) marcar como revisado el reporte:
			try { await updateReportStatus(report._id, "reviewed"); } catch {}
			setSnackbar({ open: true, message: "Publicación eliminada.", severity: "success" });
		} catch (err) {
			console.error(err);
			setSnackbar({ open: true, message: "No se pudo eliminar la publicación.", severity: "error" });
		} finally {
			await reload();
		}
	};

	// ====== Columnas ======
	const columns: ColumnDef<Report>[] = useMemo(
		() => [
			{
				id: "reporter",
				header: "Reportado por",
				minWidth: 160,
				truncate: true,
				renderCell: (r) => (
					<Text as="span" size="sm" weight="medium">
						{r?.reporter?.username ?? "—"}
					</Text>
				),
			},
			{
				id: "publication",
				header: "Publicación",
				minWidth: 240,
				truncate: true,
				renderCell: (r) => {
					const pub = r?.target;
					const pubId = pub?._id;
					const title = (pub?.title ?? "(Sin título)").trim();

					if (!pubId) {
						return (
							<Typography variant="body2" color="textSecondary">
								Publicación eliminada
							</Typography>
						);
					}

					const go = () => navigate(`/publications/${pubId}`);

					return (
						<Text
							as="button"
							size="sm"
							colorKey="primary.main"
							sx={{
								all: "unset",
								cursor: "pointer",
								fontWeight: 600,
								"&:hover": { textDecoration: "underline" },
							display: "inline-block",
							maxWidth: "100%",
							textOverflow: "ellipsis",
							overflow: "hidden",
							whiteSpace: "nowrap",
							}}
							onClick={go}
							onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									go();
								}
							}}
							role="link"
							tabIndex={0}
							aria-label={`Abrir publicación ${title}`}
						>
							{title}
						</Text>
					);
				},
			},
			{
				id: "reason",
				header: "Razón",
				minWidth: 220,
				truncate: true,
				renderCell: (r) => (
					<Text as="span" size="sm" colorKey="text.secondary">
						{r.reason || "—"}
					</Text>
				),
			},
			{
				id: "status",
				header: "Estado",
				minWidth: 120,
				renderCell: (r) => {
					if (r.status === "pending")
						return <Text size="sm" colorKey="warning.main">Pendiente</Text>;
					if (r.status === "reviewed")
						return <Text size="sm" colorKey="success.main">Revisado</Text>;
					if (r.status === "dismissed")
						return <Text size="sm" colorKey="text.disabled">Descartado</Text>;
					return <Text size="sm" colorKey="text.secondary">{r.status ?? "—"}</Text>;
				},
			},
		],
		[navigate]
	);

	// ====== Acciones ======
	const rowActions: RowAction<Report>[] = useMemo(
		() => [
			{
				label: "Enviar alerta",
				color: "primary",
				onClick: (r) => handleOpenDialog(r._id),
				visible: () => true,
			},
			{
				label: "Marcar revisado",
				color: "success",
				visible: (r) => r.status === "pending",
				onClick: (r) => handleUpdate(r._id, "reviewed"),
			},
			{
				label: "Descartar",
				color: "secondary",
				variant: "outline",
				visible: (r) => r.status === "pending",
				onClick: (r) => handleUpdate(r._id, "dismissed"),
			},
			{
				label: "Eliminar publicación",
				color: "error",
				visible: (r) => Boolean((r as any)?.target?._id),
				onClick: (r) => handleDeletePublication(r),
			}
		],
		[]
	);

	return (
		<SmartBox column gap={3} p="px12">
			<SectionTitle>Gestión de Reportes</SectionTitle>

			<TableView<Report>
				data={reports}
				rowKey="_id"
				columns={columns}
				rowActions={rowActions}
				loading={loading}
				emptyMessage="No hay reportes."
				stickyHeader
				zebra
				hoverable
				skin="default"
				responsiveMode="auto"
				actionsAsMenu
				/>
			{/* ====== Modal de envío de alerta ====== */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
				<DialogTitle>Enviar alerta al usuario</DialogTitle>
				<DialogContent>
					<FormControl fullWidth margin="normal">
						<InputLabel>Plantilla de alerta</InputLabel>
						<Select
							value={selectedTemplate}
							onChange={(e) => setSelectedTemplate(e.target.value)}
							label="Plantilla de alerta"
						>
							{templates.map((t) => (
								<MenuItem key={t} value={t}>
									{t}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{selectedTemplate === "Otra razón" && (
						<TextField
							fullWidth
							multiline
							minRows={3}
							value={customMessage}
							onChange={(e) => setCustomMessage(e.target.value)}
							label="Mensaje personalizado"
							margin="normal"
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
					<Button onClick={handleSendAlert} variant="contained" color="primary">
						Enviar
					</Button>
				</DialogActions>
			</Dialog>

			{/* ====== Snackbar ====== */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
			</SmartBox>
	);
};

export default ReportManagement;

