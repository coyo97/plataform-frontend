import React, { useEffect, useState } from "react";
import {
	Container, Title, Table, TableHeader,
	TableRow, TableCell, Button,
} from "./reportManagementStyles";
import { Typography } from "@mui/material";

import {
	listReports,
	updateReportStatus,
} from "../../../async/services/reportService";
import { Report } from "../../../types/centerAlert";

const ReportManagement: React.FC = () => {
	const [reports, setReports] = useState<Report[]>([]);

	/* carga inicial */
	useEffect(() => { listReports().then(setReports); }, []);

	/* actualizar estado */
	const handleUpdate = async (id: string, status: "reviewed" | "dismissed") => {
		try { await updateReportStatus(id, status); }
		finally { setReports(await listReports()); }
	};

	return (
		<Container>
			<Title>Gestión de Reportes</Title>
			<Table>
				<thead>
					<tr>
						<TableHeader>Reportado por</TableHeader>
						<TableHeader>Publicación</TableHeader>
						<TableHeader>Razón</TableHeader>
						<TableHeader>Estado</TableHeader>
						<TableHeader>Acciones</TableHeader>
					</tr>
				</thead>
				<tbody>
					{reports.map(r => (
						<TableRow key={r._id}>
							<TableCell>{r.reporter.username}</TableCell>
							<TableCell>
								{r.publication
									? r.publication.title
									: <Typography color="textSecondary">Publicación eliminada</Typography>}
							</TableCell>
							<TableCell>{r.reason}</TableCell>
							<TableCell>{r.status}</TableCell>
							<TableCell>
								{r.status === "pending" && (
									<>
										<Button onClick={() => handleUpdate(r._id, "reviewed")}>
											Marcar revisado
										</Button>
										<Button
											variant="secondary"
											onClick={() => handleUpdate(r._id, "dismissed")}
										>
											Descartar
										</Button>
									</>
								)}
							</TableCell>
						</TableRow>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default ReportManagement;

