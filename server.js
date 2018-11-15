const express = require('express');
const { db } = require('./models');
const { appConfig } = require('./config');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/users', require('./routers/api/users'));
app.use('/user', require('./routers/api/user'));
app.use('/tags', require('./routers/api/tags'));
app.use('/articles', require('./routers/api/articles'));
app.use('/profiles', require('./routers/api/profiles'));

(async function() {
	try {
		await db.sync();
		// await db.sync({ force: true }); // Sets up a fresh DB every time the server is started
		await db.authenticate();

		console.log('Database synced');
		app.listen(appConfig.port, () => {
			console.log('Server started at localhost:', appConfig.port);
		});
	} catch (e) {
		console.log(e);
	}
})();
