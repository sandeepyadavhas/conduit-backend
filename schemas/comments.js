const Sequelize = require('sequelize');
const DT = Sequelize.DataTypes;

let commentsModel = {
	body: {
		type: DT.TEXT,
		allowNull: false,
	}
};


module.exports = commentsModel;