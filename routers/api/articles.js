const { Router } = require('express');

const validateReq = require('../../utils/validateReq');
const slug = require('slug');
const randomstring = require("randomstring");
const { Tags, Article, Likes } = require('../../models');
const validateToken = require('../auth');


const router = Router();

router.post('/:slug/favorite', validateToken.required, async (req, res) => {
	let article = await Article.findOne({
		where: {
			slug: req.params.slug
		}
	});
	let result = await article.addLike(req.User);
	return res.status((result.length==1)?201:200).json({article});
});

router.delete('/:slug/favorite', validateToken.required, async (req, res) => {
	let article = await Article.findOne({
		where: {
			slug: req.params.slug
		}
	});
	let result = await article.removeLike(req.User);
	return res.status((result==1)?201:200).json({article});
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
			addTagPromises.push(
				setTag(newArticle, article.tagList[i])
			);
		}
		await Promise.all(addTagPromises);
	}
	return res.status(201).json({article: newArticle});
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
