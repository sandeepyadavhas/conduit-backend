const Sequelize = require('sequelize');
const DT = Sequelize.DataTypes;

tagsModel = {
	tagName: {
		type: DT.STRING(32),
		allowNull: false,
	}
}

module.exports = tagsModel;
