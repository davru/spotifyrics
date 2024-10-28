import { useState } from 'preact/hooks';
import demo_dark from './assets/demo_dark.gif';
import demo_light from './assets/demo_light.gif';

// Components
import Buttons from './components/Buttons';
import Description from './components/Description';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

// Styles
import './app.css';

export function App() {
	const [theme, setTheme] = useState(demo_dark);

	const toggleTheme = () =>
		setTheme(theme === demo_dark ? demo_light : demo_dark);

	return (
		<div className="App">
			<div className="App-bg"></div>
			<header className="App-header">
				<Navbar />
			</header>
			<div className="App-container">
				<div className="App-description">
					<div className="App-description-container">
						<Description />
						<div className="App-buttons">
							<Buttons />
						</div>
					</div>
				</div>
				<div className="App-demo">
					<div className="demo-wrapper">
						<div className="toggle-wrapper">
							<span>Toggle app theme:</span>
							<div className="toggle transparent">
								<input
									onChange={toggleTheme}
									id="transparent"
									type="checkbox"
								/>
								<label className="toggle-item" htmlFor="transparent"></label>
							</div>
						</div>

						<img
							src={demo_light}
							key={demo_light}
							height="0px"
							width="0px"
							alt="logo"
							style={{ overflow: 'hidden', position: 'absolute' }}
						/>
						<img
							src={theme}
							key={theme}
							height="calc(100% - 80px)"
							width="inherit"
							alt="logo"
						/>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}
