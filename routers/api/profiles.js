const { Router } = require('express');

const validateReq = require('../../utils/validateReq');
const slug = require('slug');
const randomstring = require("randomstring");
const { Tags, Article, Likes, User } = require('../../models');
const validateToken = require('../auth');


const router = Router();

router.post('/:username/follow', validateToken.required, async (req, res) => {
	await followUser(req.User, req.params.username, true);
	return;
});


module.exports = router;

async function followUser(currUser, username, follow) {
	let userToFollow = await User.findOne({
		where: {
			username: username
		}
	});
	if (follow) {
		await userToFollow.addFollower(currUser);
	} else {
		await userToFollow.removeFollower(currUser);
	}
	return userToFollow;
}
