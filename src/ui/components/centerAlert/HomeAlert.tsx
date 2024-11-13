import ReportThresholdSettings from "../admin/ReportThresholdSettings";
import AdminNotifications from "./AdminNotifications"
import ReportManagement from "./ReportManagement"

const HomeAlert: React.FC = () => {
	return (
		<div>
			<AdminNotifications/>
			<ReportManagement/>
			<ReportThresholdSettings/>
		</div>
	)
}

export default HomeAlert;

