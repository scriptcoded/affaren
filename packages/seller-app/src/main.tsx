import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { SellerApp } from './SellerApp.tsx';
import { DisplayApp } from './DisplayApp.tsx';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const router = createBrowserRouter([
	{
		path: '/',
		element: <SellerApp />,
	},
	{
		path: '/display',
		element: <DisplayApp />,
	},
]);

// biome-ignore lint/style/noNonNullAssertion: It's there.
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CssBaseline />
		<RouterProvider router={router} />,
	</StrictMode>,
);
