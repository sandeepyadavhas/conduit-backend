const express = require('express');
const { db } = require('./models');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', require('./routers/users'));
app.use('/user', require('./routers/user'));

(async function() {
	try {
		await db.sync();
		// await db.sync({ force: true });
		await db.authenticate();

		console.log('Database synced');
		app.listen(3939, () => {
			console.log('Server started at localhost:3939');
		});
	} catch (e) {
		console.log(e);
	}
})();
