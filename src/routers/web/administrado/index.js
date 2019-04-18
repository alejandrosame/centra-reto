import express from 'express';

import { middleware } from '..';
import { wrap } from '../..';

import pageUzantoj from './_uzantoj';
import pageRekursoj from './_rekursoj';

/**
 * Sets up the router
 * @return {express.Router} The router
 */
export default function () {
	const router = express.Router();
	router.use(middleware.requireInitialSetup);

    router.get('/rekursoj',
        middleware.requireLogin,
        wrap(pageRekursoj));

	router.get('/uzantoj',
		middleware.requireLogin,
		wrap(pageUzantoj));

	return router;
}
