const { Router } = require('express');
const { User } = require('../models');

const router = Router();

router.get('/:username', async(req, res) => {
	return res.status(200).json(
		{
			state: 'Running '+req.params.username
		}
	);
});


module.exports = router;
