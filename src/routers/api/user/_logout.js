async function user_logout (req, res, next) { // eslint-disable-line no-unused-vars
	/**
	 * POST /logout
	 * Logs out
	 *
	 * Login not required
	 * Initial setup not required
	 */
	
	req.logout();
	res.sendAPIResponse();
}

export default user_logout;
