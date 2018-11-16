let getArticle = function(article, author, tagList, favorited, favoritesCount) {
	if (article && author) {
		let finalArticle = {
			slug: article.slug,
			title: article.title,
			description: article.description,
			body: article.body,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt,

			author: author,
			tagList: (tagList)? tagList: [],
			favorited: (favorited)? favorited:false,
			favoritesCount: (favoritesCount)? favoritesCount: 0
		};
		return finalArticle;
	} else return null;
}

module.exports = getArticle;
