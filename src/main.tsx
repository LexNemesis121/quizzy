import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { TestInfoPage } from './pages/TestInfo.page.tsx';
import { TestPage } from './pages/Test.page.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />
	},
	{
		path: '/:id',
		element: <TestInfoPage />
	},
	{
		path: '/test/:id',
		element: <TestPage />
	},
	{
		path: '/test/:id/:qid',
		element: <TestPage />
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
