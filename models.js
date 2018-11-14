const Sequelize = require('sequelize');
const { dbConfig } = require('./config');

const credentials = require('./schemas/credentials');
const users = require('./schemas/users');
const tags = require('./schemas/tags');
const articles = require('./schemas/articles');

const db = new Sequelize({
	dialect: dbConfig.squelizeDialect
	, storage: (dbConfig.storageAbsolutePath)? (dbConfig.storageAbsolutePath):(__dirname + dbConfig.storageRelativePath)
	, logging: dbConfig.logging
});

const User = db.define('users', users);
const Credentials = db.define('credentials', credentials);
const Tags = db.define('tags', tags);
const Article = db.define('articles', articles);


User.hasOne(Credentials);
Credentials.belongsTo(User);

Article.hasMany(Tags);
Article.belongsTo(User);

User.hasMany(Article);
Tags.belongsTo(Article);

module.exports = {
	db,
	User,
	Article,
	Tags,
	Credentials
};
