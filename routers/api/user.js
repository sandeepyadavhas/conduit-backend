const { Router } = require('express');
const { User } = require('../../models');
const validateToken = require('../auth');

const router = Router();

router.get('/', validateToken.required, async(req, res) => {
	return res.status(200).json(req.User);
});

module.exports = router;
