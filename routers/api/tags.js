const { Router } = require('express');
const { Tags } = require('../../models');

const router = Router();

router.get('/', async(req, res) => {
	let tags = await Tags.findAll();
	return res.status(200).json({
		tags: tags
	});
});


module.exports = router;
