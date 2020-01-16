/* google oauth options 
    { 
    "web": {
        "client_id": "84420994973-p916g22s25ep14p7v2tkm7gpatbjs950.apps.googleusercontent.com",
        "project_id": "nodestarlabs",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "peS1Zir5nbzd6pcvni59CPR1",
        "redirect_uris": ["http://localhost:5500/glogin/callback"],
        "refresh_token " : "1//04D4yxqLWMveoCgYIARAAGAQSNwF-L9IryRd0wc4akxJv4clZu9rCROEMROjc0l1hh5RN6bdtRvBdFqFE49fq7rjWQYO_tySMEEQ"
    }
}
*/
const nodemailer = require("nodemailer");
const request = require('request');
const xoauth2 = require('xoauth2');
const {
    google
} = require('googleapis');

class MailService {
    constructor(config, jr) {
        this.config = config;
        this.jr = jr;
        logger.info("[*MailService]");
    }

    async initialize() {
        const oauth2Client = new google.auth.OAuth2(
            this.config.google.oauth2.clientId,
            this.config.google.oauth2.clientSecret, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
            refresh_token: this.config.google.oauth2.refreshToken
        });
        let accessToken = oauth2Client.getAccessToken();

        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: 'OAuth2',
                user: "nodestar.lab@gmail.com",
                accessToken: accessToken,
                clientId: this.config.google.oauth2.clientId,
                clientSecret: this.config.google.oauth2.clientSecret,
                refreshToken: this.config.google.oauth2.refreshToken
            },
            /*  other options
                secure: true, // true for 465, false for other ports
                port: 587, // secure should be false 
                tls: {
                    rejectUnauthorized: false
                } 
            */
        });
    }

    async processMail(info, additionalInfo) {
        let data = Object.assign({}, info, additionalInfo);
        let msg = await this.getMessage(data, "signupWelcome");
        return await this.sendMail(
            this.config.email,
            info.email,
            "Verification Email",
            msg
        );
    }

    async getMessage(info, template) {
        return this.jr.TemplateService.renderTemplate(template, info);
    }

    async sendMail(from, to, subject, message, attachment = null) {
        let options = {
            from: from,
            to: to,
            subject: subject,
            text: message,
            html: message
        };
        return await this.transporter.sendMail(options);
    }
}

module.exports = MailService;