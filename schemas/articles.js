const Sequelize = require('sequelize');
const DT = Sequelize.DataTypes;

articlesModel = {
	title: {
		type: DT.STRING(255),
		allowNull: false,
	},
	slug: {
		type: DT.STRING(32),
		allowNull: false,
		unique: true
	},
	description: {
		type: DT.STRING(255),
		allowNull: false,
	},
	body: {
		type: DT.TEXT,
		allowNull: false,
	}
}

module.exports = articlesModel;
