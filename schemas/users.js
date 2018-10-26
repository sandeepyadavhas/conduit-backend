const Sequelize = require('sequelize');
const DT = Sequelize.DataTypes;

userModel = {
	username: {
		type: DT.STRING(32),
		allowNull: false,
		unique: true,
		validate: { len: [8,32] }
	},
	email: {
		type: DT.STRING(32),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	token: {
		type: DT.STRING(255),
		allowNull: false,
		unique: true
	},
	image: {
		type: DT.STRING(32),
		allowNull: false,
		defaultValue: 'https://static.productionready.io/images/smiley-cyrus.jpg'
	},
	bio: {
		type: DT.TEXT,
		allowNull: false,
		defaultValue: ''
	}
};

module.exports = userModel;
