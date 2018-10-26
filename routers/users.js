const { Router } = require('express');
const { User, Credentials } = require('../models');
const jwtGen = require('../utils/jwt-gen');
const validateSignUp = require('../utils/validate-sign-up');

const router = Router();

router.post('/login', async(req, res) => {
	let user = await User.findOne({
		where: {
			email: req.body.user.email
		}
	});
	if (user) {
		const cred = await user.getCredential();
		if (cred.password == req.body.user.password) {
			return res.status(200).json({
				user
			});
		}
	}
	return res.status(422).json(
		{
			"email or password" : ["is invalid"]
		}
	);
});


router.post('/', async (req, res) => {

	const errors = validateSignUp(req.body);
	if (Object.keys(errors).length != 0) {
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

		return res.status(201).json(
			{
				message: 'User Added',
				user: newUser
			}
		);
	}
	catch(err) {
		return res.status(422).json(
			{
				errors: {
					message: err.errors[0].message
				}
			}
		);
	}
});

module.exports = router;
