const { Router } = require('express');

var util = require('util');
const { User } = require('../../models');
const validateToken = require('../auth');
const getProfile = require('../../dto/profile');

const router = Router();

router.post('/:username/follow', validateToken.required, async (req, res) => {
	let otherUser = await User.findOne({
		where: {
			username: req.params.username
		}
	});
	if (!otherUser) {
		res.status(404).send(util.format("Username: %s does not exist.", req.params.username));
	}
	let result = await otherUser.addFollower(req.User);
	return res.status((result.length==1)?201:200).json({profile: getProfile(otherUser, true)});
});

router.delete('/:username/follow', validateToken.required, async (req, res) => {
	let otherUser = await User.findOne({
		where: {
			username: req.params.username
		}
	});
	if (!otherUser) {
		res.status(404).send(util.format("Username: %s does not exist.", req.params.username));
	}
	let result = await otherUser.removeFollower(req.User);
	return res.status((result==1)?201:200).json({profile: getProfile(otherUser, false)});
});

router.get('/:username', validateToken.optional, async (req, res) => {
	let otherUser = await User.findOne({
		where: {
			username: req.params.username
		}
	});
	if (!otherUser) {
		res.status(404).send(util.format("Username: %s does not exist.", req.params.username));
	}
	let following = false;
	if (req.User) {
		following = await otherUser.hasFollower(req.User);
	}
	return res.status(200).json({profile: getProfile(otherUser, following)});
});


module.exports = router;
