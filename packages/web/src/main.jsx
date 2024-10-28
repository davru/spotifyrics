import { AptabaseProvider } from '@aptabase/react';
import { render } from 'preact';
import { App } from './app.jsx';
import './index.css';

render(
	<AptabaseProvider appKey={import.meta.env.VITE_APTABASE_KEY}>
		<App />
	</AptabaseProvider>,
	document.getElementById('app'),
);
