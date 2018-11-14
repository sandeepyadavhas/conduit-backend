const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');

const generateJwtToken = async function(username) {
	return jwt.sign({username: username}, jwtConfig.privateKey);
}

module.exports = generateJwtToken;
