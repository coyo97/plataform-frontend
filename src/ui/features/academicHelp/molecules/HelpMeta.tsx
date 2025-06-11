import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';

interface Props {
	faculty: string; career: string; semester?: string; subject: string;
}
const HelpMeta: React.FC<Props> = ({ faculty, career, semester, subject }) => (
	<SmartBox column gap="px4">
		<Text size="sm" colorKey="neutral.black.500">{faculty}</Text>
		<Text size="sm" colorKey="neutral.black.500">{career} {semester && `· Sem ${semester}`}</Text>
		<Text weight="bold" size="md">{subject}</Text>
	</SmartBox>
);
export default HelpMeta;

