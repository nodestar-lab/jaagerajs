class MailServer{
    constructor(config, jr){
        this.config = config;
        this.jr = jr;
        console.log("[--] MailServer");
    }

    sendMail(params){
        console.log("inside the sendMail.", params);
    }
}

module.exports = MailServer;