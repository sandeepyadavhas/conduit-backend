const jwt = require('jsonwebtoken');

const generateJwtToken = async function(username) {
	return jwt.sign({username: username}, "Chat deni maar deli khich ke tamacha, Hihi hihi hans delen Rinkiya ke papa");
}

module.exports = generateJwtToken;
