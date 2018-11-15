let validateReq = function(formType, data) {
	let key = {};
	let msg = {};

	key.emailOrPass = "email or password";
	key.article = "article";
	msg.noArticleObject = "must be encapsulated inside 'article' object";
	msg.noUserObject = "must be encapsulated inside 'user' object";


	key.username = "username";
	key.password = "password";
	key.email = "email";
	msg.invalidLength = 'must be in length [8, 32]';
	msg.unavailable = "can't be blank";
	msg.notValid = 'is invalid'; // for emails

	let errors;
	switch(formType) {
		case "login": {
			if (!data.user) {
				if (!errors) errors = {};
				errors[key.emailOrPass] = [msg.noUserObject];
			}
			else if (!(data.user.email && data.user.password)) {
				if (!errors) errors = {};
				errors[key.emailOrPass] = [msg.unavailable];
			}
			return errors;
		}
		case "signup": {
			if (!data.user) {
				if (!errors) errors = {};
				errors[key.emailOrPass] = [msg.noUserObject];
				return errors;
			}
			let user = data.user;
			let requiredFields = ['username', 'password', 'email'];
			for (let i=0;i<requiredFields.length;++i) {
				if (!user[requiredFields[i]]) {
					if (!errors) errors = {};
					errors[requiredFields[i]] = [msg.unavailable];
				}
			}
			if (errors) return errors;
			if (user.username) {
				if (! ((user.username.length >= 8) && (user.username.length <= 32))) {
					if (!errors) errors = {};
					errors[key.username] = [msg.invalidLength];
				}
			}
			if (user.password) {
				if (! ((user.password.length >= 8) && (user.password.length <= 32))) {
					if (!errors) errors = {};
					errors[key.password] = [msg.invalidLength];
				}
			}
			if (user.email) {
				if (!validateEmail(user.email)) {
					if (!errors) errors = {};
					errors[key.email] = [msg.notValid];
				}
			}
			return errors;
		}
		case "add-article": {
			if (!data.article) {
				if (!errors) errors = {};
				errors[key.article] = [msg.noArticleObject];
				return errors;
			}
			let requiredFields = ['title', 'description', 'body'];
			let article = data.article;
			for (let i=0;i<requiredFields.length; ++i) {
				if (!article[requiredFields[i]]) {
					if (!errors) errors = {};
					errors[requiredFields[i]] = [msg.unavailable];
				}
			}
			return errors;
		}
	}
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}


module.exports = validateReq;