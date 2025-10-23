// src/ui/components/alerts/HomeAlert.tsx
import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import AdminNotifications from "./AdminNotifications";
import ReportManagement from "./ReportManagement";
import ReportThresholdSettings from "../admin/ReportThresholdSettings";

type TabKey = "notificaciones" | "reportes" | "umbrales";

const TAB_ORDER: TabKey[] = ["notificaciones", "reportes", "umbrales"];

function a11yProps(index: number) {
	return {
		id: `alerts-tab-${index}`,
		"aria-controls": `alerts-tabpanel-${index}`,
	};
}

const TabPanel: React.FC<{
	children?: React.ReactNode;
	value: number;
	index: number;
	keepMounted?: boolean;
}> = ({ children, value, index, keepMounted = false }) => {
	const hidden = value !== index;
	if (!keepMounted && hidden) return null;
	return (
		<div
			role="tabpanel"
			hidden={hidden}
			id={`alerts-tabpanel-${index}`}
			aria-labelledby={`alerts-tab-${index}`}
			style={{ width: "100%" }}
		>
			{!hidden && <Box sx={{ pt: 2 }}>{children}</Box>}
		</div>
	);
};

const HomeAlert: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// Lee ?tab= de la URL y sincroniza con índice
	const tabParam = (searchParams.get("tab") as TabKey) || "notificaciones";
	const currentIndex = Math.max(0, TAB_ORDER.indexOf(tabParam));

	const handleChange = (_: React.SyntheticEvent, newIndex: number) => {
		const nextKey = TAB_ORDER[newIndex] ?? "notificaciones";
		// Preserva otros query params y solo cambia ?tab=
		const clone = new URLSearchParams(searchParams);
		clone.set("tab", nextKey);
		setSearchParams(clone, { replace: false });
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider", position: "sticky", top: 0, zIndex: 1, bgcolor: "background.paper" }}>
				<Tabs
					value={currentIndex}
					onChange={handleChange}
					variant="scrollable"
					allowScrollButtonsMobile
					aria-label="Pestañas de Centro de Alertas"
					sx={{
						justifyContent: "center",
						"& .MuiTabs-flexContainer": {
							justifyContent: "center",
					},
					}}
				>
					<Tab label="Notificaciones" {...a11yProps(0)} />
					<Tab label="Reportes" {...a11yProps(1)} />
					<Tab label="Umbrales" {...a11yProps(2)} />
				</Tabs>
			</Box>

			<TabPanel value={currentIndex} index={0} keepMounted>
				<AdminNotifications />
			</TabPanel>

			<TabPanel value={currentIndex} index={1} keepMounted>
				<ReportManagement />
			</TabPanel>

			<TabPanel value={currentIndex} index={2} keepMounted>
				<ReportThresholdSettings />
			</TabPanel>
		</Box>
	);
};

export default HomeAlert;

