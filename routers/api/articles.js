const { Router } = require('express');

const validateReq = require('../../utils/validateReq');
const slug = require('slug');
const randomstring = require("randomstring");
const { Tags, Article, Likes } = require('../../models');
const validateToken = require('../auth');


const router = Router();

router.post('/:slug/favorite', validateToken.required, async (req, res) => {
	let article = await setUnsetLike(req.User, req.params.slug, true);
	return res.status(201).json({article});
});

router.delete('/:slug/favorite', validateToken.required, async (req, res) => {
	let article = await setUnsetLike(req.User, req.params.slug, false);
	return res.status(201).json({article});
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
		for (let i = 0;i<article.tagList.length; ++i) {
			let tag = await Tags.findOrCreate({
				where: {
					tagName: article.tagList[i]
				}
			});
			await newArticle.addTag(tag[0]);
		}
	}
	return res.status(201).json({article: newArticle});
});

module.exports = router;

async function setUnsetLike(User, slug, like) {
	let article = await Article.findOne({
		where: {
			slug: slug
		}
	});
	if (like) {
		await article.addLike(User);
	} else {
		await article.removeLike(User);
	}
	return article;
}
