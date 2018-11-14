// DB Config
let dbConfig = new (function() {
	this.squelizeDialect = 'sqlite';
	// dbConfig.storageAbsolutePath = 'C:/Users/sandeepyadav/Documents/Node Projects/JS Evaluation/conduit-backend/store.db';
	this.storageRelativePath = '/store.db';
	this.logging = false;
})();

// App Config
let appConfig = new (function() {
	this.port = 3939;
})();

let jwtConfig = new (function() {
	this.privateKey = 'Chat deni maar deli khich ke tamacha, Hihi hihi hans delen Rinkiya ke papa';
})();

module.exports = {
	dbConfig,
	appConfig,
	jwtConfig
};
