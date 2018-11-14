let validateReq = function(formType, data) {
	let key = {};
	let msg = {};

	key.emailOrPass = "email or password";
	msg.noUserObject = "must be encapsulated inside 'user' object";

	key.username = "username";
	key.password = "password";
	key.email = "email";
	msg.length = 'must be in length [8, 32]';
	msg.unavailable = "can't be blank";
	msg.notValid = 'is invalid'; // for emails

	let errors;
	switch(formType) {
		case "login":
			if (!data.user) {
				errors = {};
				errors[key.emailOrPass] = [msg.noUserObject];
			}
			else if (!(data.user.email && data.user.password)) {
				errors = {};
				errors[key.emailOrPass] = [msg.unavailable];
			}
			return errors;
		case "signup":
			if (!data.user) {
				errors = {};
				errors[key.emailOrPass] = [msg.noUserObject];
				return errors;
			}
			let user = data.user;
			if (user.username) {
				if (! ((user.username.length >= 8) && (user.username.length <= 32))) {
					errors[key.username] = [msg.length];
				}
			} else {
				errors[key.username] = [msg.unavailable];
			}
		
			if (user.password) {
				if (! ((user.password.length >= 8) && (user.password.length <= 32))) {
					errors[key.password] = [msg.length];
				}
			} else {
				errors[key.password] = [msg.unavailable];
			}

			if (user.email) {
				if (!validateEmail(user.email)) {
					errors[key.email] = [msg.notValid];
				}
			}
			else {
				errors[key.email] = [msg.unavailable];
			}
			return errors;
	}
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}


module.exports = validateReq;