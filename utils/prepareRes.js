let prepareRes = function(resType, data) {
	
	let key = {};
	let msg = {};

	key.emailOrPass = "email or password";
	msg.wrongCredentials = "is invalid";
	
	switch(resType) {
		case "wrong-credentials":
			let response = {};
			response[key] = ["is invalid"];
			return response;
	}
}

module.exports = prepareRes;
