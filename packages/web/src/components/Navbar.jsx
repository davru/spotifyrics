import logo from '../assets/logo.png';

const Navbar = () => {
	return (
		<>
			<img
				src={logo}
				width="40px"
				height="40px"
				className="App-logo"
				alt="logo"
			/>
			<h1>Spotifyrics</h1>
			<ul className="App-nav">
				<li>
					<span>The app</span>
				</li>
				<li>
					<a href="mailto:contact@davru.dev">Report issue</a>
				</li>
				<li>
					<a href="https://davru.dev" target="_blank">
						The developer ;)
					</a>
				</li>
			</ul>
		</>
	);
};

export default Navbar;
