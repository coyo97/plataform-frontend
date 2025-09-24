import SearchOverlay from "./SearchOverlay"


const HomeOverlay: React.FC = () => {
	return(
		<>
			<SearchOverlay
					onSearch={(q, cat) =>
							console.log()
						}
			/>
		</>
	)
}
export default HomeOverlay;
