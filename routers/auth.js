const { User } = require('../models');

function getTokenFromHeader(req){
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' || req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1];
	}
	return null;
}

let getUser = async function(req) {
	let token = getTokenFromHeader(req);
	if (token) {
		var user = await User.findOne({
			where: { token: token}
		});
	}
	return user;
}

let validateToken = {};

validateToken.required = async function(req, res, next) {
	var user = await getUser(req);
	if (user) {
		req.User = user;
		next();
	} else {
		return res.status(401).send("HTTP Token: Access denied.");
	}
}

validateToken.optional = async function(req, res, next) {
	var user = await getUser(req);
	req.User = user;
	next();
}

module.exports = validateToken;
