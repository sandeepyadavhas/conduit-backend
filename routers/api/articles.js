const { Router } = require('express');

const validateReq = require('../../utils/validateReq');
const slug = require('slug');
const randomstring = require("randomstring");
const { Tags, Article, Likes, User, FollowerFollowee } = require('../../models');
const validateToken = require('../auth');
const getArticle = require('../../dto/article');
const getProfile = require('../../dto/profile');
var util = require('util');

const router = Router();

router.post('/:slug/favorite', validateToken.required, async (req, res) => {
	let article = await Article.findOne({
		where: {
			slug: req.params.slug
		}
	});
	let result = await article.addLike(req.User);
	return res.status((result.length==1)?201:200).json({article: await processArticle(req.User, article)});
});

router.delete('/:slug/favorite', validateToken.required, async (req, res) => {
	let article = await Article.findOne({
		where: {
			slug: req.params.slug
		}
	});
	let result = await article.removeLike(req.User);
	return res.status((result==1)?201:200).json({article: await processArticle(req.User, article)});
});


router.get('/feed', validateToken.required, async (req, res) => {
	let followers = await FollowerFollowee.findAll({
		where: {
			followerId: req.User.id
		},
		attributes: ['followeeId']
	});
	followers = followers.map(follower => follower.followeeId);

	let result = await Article.findAndCountAll({
		include: [
			{
				model: User,
				where: {
					id: followers
				}
			}
		],
		distinct: true,
		offset: (req.query.offset)? req.query.offset : 0,
		limit: (req.query.limit)? req.query.limit : 10,
		order: [['updatedAt', 'DESC']]
	});
	let articles = [];
	for (let i=0;i<result.rows.length;++i) {
		articles.push(
			await processArticle(req.User, result.rows[i])
		);
	}
	return res.status(200).json({articles: articles, articlesCount: result.count});
});


router.get('/:slug', validateToken.optional, async (req, res) => {
	let article = await Article.findOne({
		where: {
			slug: req.params.slug
		}
	});
	if (!article) {
		res.status(404).send(util.format("Article slug: %s does not exist.", req.params.slug));
	}
	return res.status(200).json({article: await processArticle(req.User, article)});
});

router.post('/', validateToken.required, async (req, res) => {
	let errors = validateReq("add-article", req.body);
	if (errors) {
		return res.status(422).json({errors: errors});
	}
	let article = req.body.article;
	let slugStr = slug(article.title + ' ' + randomstring.generate(7));
	let newArticle = await req.User.createArticle({
		title: article.title,
		slug: slugStr,
		description: article.description,
		body: article.body
	});
	if (newArticle && article.tagList) {
		let addTagPromises = [];
		for (let i = 0;i<article.tagList.length; ++i) {
			await setTag(newArticle, article.tagList[i]);
		}
	}
	return res.status(201).json({article: await processArticle(req.User, newArticle, req.User)});
});

router.get('/', validateToken.optional, async (req, res) => {
	let includeFilters = prepareFilters(req.query.author, req.query.tag, req.query.favorited);
	let result = await Article.findAndCountAll({
		include: includeFilters,
		distinct: true,
		offset: (req.query.offset)? req.query.offset : 0,
		limit: (req.query.limit)? req.query.limit : 10,
		order: [['updatedAt', 'DESC']]
	});
	let articles = [];
	for (let i=0;i<result.rows.length;++i) {
		articles.push(
			await processArticle(req.User, result.rows[i])
		);
	}
	return res.status(200).json({articles: articles, articlesCount: result.count});
});

router.post('/:slug/comments', validateToken.required, async(req, res) => {
	const errors = validateReq('add-comment', req.body);
	if (errors) {
		return res.status(422).json({
			errors: errors
		});
	}

	let article = await Article.findOne({
		where: {
			slug: req.params.slug
		}
	});
	if (!article) {
		res.status(404).send(util.format("Article slug: %s does not exist.", req.params.slug));
	}
	let comment = await req.User.createComment({
		body: req.body.comment.body
	});
	comment = await comment.setArticle(article);
	return res.status(201).json({comment: await prepareComment(comment, req.User)});
})

router.get('/:slug/comments', validateToken.optional, async (req, res) => {
	let article = await Article.findOne({
		include: [
			{
				model: User
			}
		],
		where: {
			slug: req.params.slug
		},
		order: [['updatedAt', 'DESC']]
	});
	if (!article) {
		res.status(404).send(util.format("Article slug: %s does not exist.", req.params.slug));
	}
	let comments = await article.getComments();
	for (let i = 0;i<comments.length; ++i) {
		comments[i] = await prepareComment(comments[i], req.User);
	}
	return res.status(200).json({comments});
});

module.exports = router;

async function setTag(newArticle, tagName) {
	let tag = await Tags.findOrCreate({
		where: {
			tagName: tagName
		}
	});
	await newArticle.addTag(tag[0]);
}

async function processArticle(currUser, article, authorOptional) {
	// author is optional, if provided it is used else it is extracted from article
	let following = false, favorited = false;
	let author = (authorOptional)? authorOptional: ((article.user)? article.user : await article.getUser());
	if (currUser) {
		following = await author.hasFollower(currUser);
		favorited = await article.hasLike(currUser);
	}
	let tagList = (await article.getTags()).map(tag => tag.tagName);
	let favoritesCount = await article.countLikes();
	return getArticle(article, getProfile(author, following), tagList, favorited, favoritesCount);
}

function prepareFilters(authorParam, tagParam, favoritedParam) {
	let includeFilter = [];
	includeFilter.push({
		model: User,
	});
	if (authorParam) {
		includeFilter[includeFilter.length - 1].where = {
			username: authorParam
		};
	}
	includeFilter.push({
		model: Tags,
		// through: {attributes: []},
		attributes: []
	});
	if (tagParam) {
		includeFilter[includeFilter.length - 1].where = {
			tagName: tagParam
		};
	}
	if(favoritedParam) {
		includeFilter.push({
			model: User,
			as: 'Likes',
			attributes: [],
			where: {
				username: favoritedParam
			}
		});
	}
	return includeFilter;
}

async function prepareComment(comment, currUser, authorOptional) {
	let fields = ['id', 'createdAt', 'updatedAt', 'body'];
	let finalComment = {};
	for (let i=0;i<fields.length; ++i) {
		finalComment[fields[i]] = comment[fields[i]];
	}
	let author = (authorOptional)? authorOptional: ((comment.user)? comment.user: await comment.getUser());
	let following = false;
	if (currUser) {
		following = await author.hasFollower(currUser);
	}
	finalComment.author = getProfile(author, following);
	return finalComment;
}
