const { Router } = require('express');
const { User } = require('../models');

const router = Router();

router.get('/', async(req, res) => {
	let auth = req.headers.authorization;
	let prefix = "Token ";
	if (auth.startsWith(prefix)) {
		auth = auth.substring(prefix.length);
	}
	const user = await User.findOne({
		where: {
			token: auth
		}
	});
	if (user) {
		return res.status(200).json(
			{
				user
			}
		);
	} else {
		return res.status(401).send("HTTP Token: Access denied.");
	}
});


module.exports = router;
