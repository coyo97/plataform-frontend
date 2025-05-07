import CommentModerationSettings from "./CommentModerationSettings";
import ModerationSettings from "./ModerationSettings";

const HomeModerator: React.FC = () => {
	return (
		<div>
			<CommentModerationSettings/>
			<ModerationSettings/>
		</div>
	);
}

export default HomeModerator;
