const validateSignUp = function(body) {
	let errors = {};
	if (!body.user) {
		errors.error = "Requests body does not contain 'user'";
		return errors;
	}

	let user = body.user;
	if (user.username) {
		if (! ((user.username.length >= 8) && (user.username.length <= 32))) {
			errors.username = ['Username must be in length [8, 32]'];
		}
	} else {
		errors.username = ['Username cannot be blank'];
	}

	if (user.password) {
		if (! ((user.password.length >= 8) && (user.password.length <= 32))) {
			errors.password = ['Password must be in length [8, 32]'];
		}
	} else {
		errors.password = ['Password cannot be blank'];
	}

	if (user.email) {
		if (!validateEmail(user.email)) {
			errors.email = ['Email is not valid'];
		}
	}
	else {
		errors.email = ['Email cannot be blank'];
	}

	return errors;
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

module.exports = validateSignUp;
