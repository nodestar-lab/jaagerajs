const Handlebars = require("handlebars");
const fs = require("fs");

class TemplateService {
    constructor(config, jr) {
        this.config = config;
        this.jr = jr;
        this.templates = {};
        logger.info("[*TemplateService]");
    }

    initialize() {
        let dir = this.config.path.app + this.config.path.template;
        let files = fs.readdirSync(dir);
        for (let f of files) {
            let temp = fs.readFileSync(dir + "/" + f, "utf8");
            this.templates[f.split(".")[0]] = Handlebars.compile(temp);
        }
        return Promise.resolve();
    }

    renderTemplate(key, data) {
        if (this.templates[key]) {
            return this.templates[key](data);
        }
        return "No template found";
    }
}

module.exports = TemplateService;