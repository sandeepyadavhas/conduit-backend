const { Router } = require('express');

const validateReq = require('../../utils/validateReq');
const slug = require('slug');
const randomstring = require("randomstring");
const { Tags, Article, Likes, User } = require('../../models');
const validateToken = require('../auth');
const getArticle = require('../../dto/article');
const getProfile = require('../../dto/profile');

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

router.get('/:slug', validateToken.optional, async (req, res) => {
	let article = await Article.findOne({
		where: {
			slug: req.params.slug
		}
	});
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
	let authorFilter = {}, tagFilter ={}, favFilter ={};
	if (req.query.author) {
		authorFilter = {
			username: req.query.author
		}
	}
	if(req.query.tag){
		tagFilter = {
			tagName: req.query.tag
		}
	}
	if(req.query.favorited){
		favFilter = {
			username: req.query.favorited
		}
	}
	let result = await Article.findAndCountAll({
		include:[
			{
				model: User,
				where: authorFilter
			},
			{
				model: Tags,
				where: tagFilter
			},
			// {

			// }
		],
		distinct: true,
		offset: (req.query.offset)? req.query.offset : 0,
		limit: (req.query.limit)? req.query.limit : 10,
		order: [['updatedAt', 'DESC']]
	});
	return res.status(200).json({articles: result.rows, count: result.count});
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
	let author = (authorOptional)? authorOptional: await article.getUser();
	if (currUser) {
		following = await author.hasFollower(currUser);
		favorited = await article.hasLike(currUser);
	}
	let tagList = (await article.getTags()).map(tag => tag.tagName);
	let favoritesCount = await article.countLikes();
	return getArticle(article, getProfile(author, following), tagList, favorited, favoritesCount);
}
