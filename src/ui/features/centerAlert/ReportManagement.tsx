// src/ui/components/reports/ReportManagement.tsx
import React, { useEffect, useMemo, useState } from "react";
import Text from "../../shared/atoms/typography/Text";
import SmartBox from "../../shared/atoms/box/SmartBox";
import SectionTitle from "../../shared/atoms/titles/SectionTitle";
import { Typography } from "@mui/material";

import TableView from "../../shared/organisms/table/TableView";
import type { ColumnDef, RowAction } from "../../shared/organisms/table/tableView.types";

import { listReports, updateReportStatus } from "../../../async/services/reportService";
import { Report } from "../../../types/centerAlert";

const ReportManagement: React.FC = () => {
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);

	/* ===== Carga inicial ===== */
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

	/* ===== Actualizar estado ===== */
	const handleUpdate = async (id: string, status: "reviewed" | "dismissed") => {
		try {
			await updateReportStatus(id, status);
		} finally {
			await reload();
		}
	};

	/* ===== Columnas ===== */
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
				renderCell: (r) =>
					r?.publication ? (
						<Text as="span" size="sm" colorKey="text.primary">
							{r.publication.title}
						</Text>
				) : (
					<Typography variant="body2" color="textSecondary">
						Publicación eliminada
					</Typography>
				),
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
		[]
	);

	/* ===== Acciones ===== */
	const rowActions: RowAction<Report>[] = useMemo(
		() => [
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
				/>
			</SmartBox>
	);
};

export default ReportManagement;

