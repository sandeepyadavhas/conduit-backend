let getProfile = function(user, following) {
	if (user) {
		let profile = {
			username: user.username,
			bio: user.bio,
			image: user.image,
			following: false
		};
		if (following) {
			profile.following = following;
		}
		return profile;
	} else return null;
}

module.exports = getProfile;
