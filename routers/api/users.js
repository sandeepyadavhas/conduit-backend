const { Router } = require('express');
const { User } = require('../../models');
const jwtGen = require('../../utils/jwt-gen');
const validateReq = require('../../utils/validateReq');
const validateToken = require('../auth');

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


router.put('/', validateToken.required, async (req, res) => {
	const errors = validateReq('update-user', req.body);
	if (errors) {
		return res.status(422).json({
			errors: errors
		});
	}

	try {
		let newUser = generateUser(req.body.user, req.User);
		newUser = await newUser.save();
		if (req.body.user.password) {
			let cred = await newUser.getCredential();
			cred.password = req.body.user.password;
			cred = await cred.save();
		}
		return res.status(201).json({user: newUser});
	}
	catch(err) {
		return res.status(422).json({errors: {message: err.errors[0].message}});
	}
});

module.exports = router;

function generateUser(userBody, userModel) {
	let fields = ['username', 'email', 'image', 'token', 'bio'];
	for (let i = 0;i<fields.length;++i) {
		let field = fields[i];
		if (userBody[field]) {
			userModel[field] = userBody[field];
		}
	}
	return userModel;
}
