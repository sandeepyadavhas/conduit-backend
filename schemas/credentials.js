const Sequelize = require('sequelize');
const DT = Sequelize.DataTypes;

passwordModel = {
	password: {
		type: DT.STRING(32),
		allowNull: false,
		validate: { len: [8,32] }
	}
}

module.exports = passwordModel;
