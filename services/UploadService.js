class UploadService {
	constructor(config, jr) {
		this.config = config;
		this.jr = jr;
		logger.info("[*UploadService]");
	}

	intialize() {}

	setup(modules) {}

	isModuleAllowed(moduleName) {
		return [];
	}
}

module.exports = UploadService;
