async function agordoj (req, res, next) { // eslint-disable-line no-unused-vars
	const data = {
		title: 'Agordoj',
		scripts: [
			'/js/cr/agordoj.js',
			'/plugins/jquery-validation/jquery.validate.js',
			'/js/jquery.validate.eo.js'
		],
		pageDataObj: {
			userDetails: await req.user.getNameDetails()
		}
	};
	await res.sendRegularPage('agordoj', data);
}

export default agordoj;
