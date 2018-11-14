const { Router } = require('express');
const { User, Credentials } = require('../models');
const jwtGen = require('../utils/jwt-gen');
const validateReq = require('../utils/validateReq');

const router = Router();

router.post('/login', async(req, res) => {
	let errors = validateReq('login', req.body);
	if (errors) {
		return res.status(422).json({errors});
	}
	const user = await User.findOne({
		where: {
			email: req.body.user.email
		}
	});
	if (user) {
		const cred = await user.getCredential();
		if (cred.password == req.body.user.password) {
			return res.status(200).json({user});
		}
	}
	return res.status(422).json({errors: prepareRes("wrong-credentials")});
});


router.post('/', async (req, res) => {
	const errors = validateReq('signup', req.body);
	if (errors) {
		return res.status(422).json({
			errors: errors
		});
	}

	try {
		let user = req.body.user;
		const userToken = await jwtGen(user.username);
		
		const newUser = await User.create({
			username: user.username,
			email: user.email,
			token: userToken
		});
		await newUser.createCredential({
			password: user.password,
		});
		return res.status(201).json({user: newUser});
	}
	catch(err) {
		return res.status(422).json({errors: {message: err.errors[0].message}});
	}
});

module.exports = router;
