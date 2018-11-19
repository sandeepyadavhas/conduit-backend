const Sequelize = require('sequelize');
const { dbConfig } = require('./config');

const credentials = require('./schemas/credentials');
const users = require('./schemas/users');
const tags = require('./schemas/tags');
const articles = require('./schemas/articles');
const comments = require('./schemas/comments');

const db = new Sequelize({
	dialect: dbConfig.squelizeDialect
	, storage: (dbConfig.storageAbsolutePath)? (dbConfig.storageAbsolutePath):(__dirname + dbConfig.storageRelativePath)
	, logging: dbConfig.logging
});

const User = db.define('users', users);
const Credentials = db.define('credentials', credentials);
const Tags = db.define('tags', tags);
const Article = db.define('articles', articles);
const Comment = db.define('comment', comments);

const ArticleTags = db.define('article_tags', {});
const Likes = db.define('likes', {});
const FollowerFollowee = db.define('follower_followee', {});

User.hasOne(Credentials);

Credentials.belongsTo(User);
Article.belongsTo(User);

Article.hasMany(Comment);
User.hasMany(Comment);
Comment.belongsTo(Article);
Comment.belongsTo(User);

Article.belongsToMany(Tags, { through: ArticleTags});
Tags.belongsToMany(Article, { through: ArticleTags});

Article.belongsTo(User);
User.hasMany(Article);

User.belongsToMany(Article, { through: Likes, as: 'Likes'});
Article.belongsToMany(User, { through: Likes, as: 'Likes'});

User.belongsToMany(User, { through: FollowerFollowee, as: 'follower', foreignKey: 'followeeId'});
User.belongsToMany(User, { through: FollowerFollowee, as: 'followee', foreignKey: 'followerId'});

module.exports = {
	db
	, User
	, Article
	, Comment
	, Tags
	, Credentials
	, ArticleTags
	, Likes
	, FollowerFollowee
};
