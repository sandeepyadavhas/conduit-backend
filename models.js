const Sequelize = require('sequelize');

const credentials = require('./schemas/credentials');
const users = require('./schemas/users');
const tags = require('./schemas/tags');
const articles = require('./schemas/articles');

const db = new Sequelize({
	dialect: 'sqlite',
	storage: __dirname + '/store.db'
	,logging: false
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
