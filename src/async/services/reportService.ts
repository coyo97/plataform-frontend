import { get, put, post } from "../api";
import getEnvVariables from "../../config/configEnvs";
import * as R from "../routes/reportRoutes";
import { Report } from "../../types/centerAlert";

const { HOST, SERVICE } = getEnvVariables();
const url = (p: string) => `${HOST}${SERVICE}${p}`;

export const listReports = () =>
	get<{ reports: Report[] }>(url(R.REPORTS), {}).then(r => r.reports);

export const updateReportStatus = (id: string, status: "reviewed" | "dismissed") =>
	put<void>(url(R.REPORT(id)), { status });

export const sendReportNotification = (
  reportId: string,
  message: string,
  type = "report_alert"
) =>
  post<void>(url(`${R.REPORT(reportId)}/notify`), { message, type });
