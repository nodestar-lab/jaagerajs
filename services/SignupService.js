class SignupService {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*SignupService]");
  }

  async handleSignup(req, res, next) {
    let userInfo = req.body;
    let tokenId;
    let generated_count;
    // need to refactor these above variable
    this.isUnqiueEmail(userInfo)
      .then((checkUnique) => {
        logger.info("checking is user is unique...");
        if (checkUnique && checkUnique.unique) {
          return this.saveData(userInfo);
        } else {
          // res.send(checkUnique);
          throw new Error(checkUnique.message);
        }
      })
      .then((result) => {
        return this.jr.OTPService.getOTP(userInfo);
      })
      .then((otp_details) => {
        logger.info("otp sent...");
        tokenId = otp_details.tokenId;
        generated_count = otp_details.generated_count;
        return this.jr.MailService.processMail(userInfo, otp_details);
      })
      .then((mailSent) => {
        logger.info("mail sent ");
        res.send({
          sentOTP: true,
          email: userInfo.email,
          tokenId: tokenId,
          generated_count: generated_count
        });
        return mailSent;
      })
      .catch((err) => {
        this.jr.JageeraErrorHandler.handleError(err, req, res);
      });
  }

  async isUnqiueEmail(data) {
    let info = await this.jr.DBManager.db.user.findOne({
      email: data.email
    });
    if (info && info.email) {
      return {
        message: "email already exist",
        unique: false
      };
    }
    return {
      unique: true
    };
  }

  async verifyUser(req, res) {
    // get emailId also while verifying
    // after that create login session
    // send cookie and token to front end
    // auntheticate with the passport.auth with username and password

    let otpData = req.body;
    this.jr.OTPService.verify(otpData)
      .then(async (result) => {
        if (result.verfied) {
          await this.saveUser(result);
        }
        return result;
      })
      .then((resultObj) => {
        res.send(resultObj);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async saveUser(info) {
    // get signup data
    let user = await this.jr.DBManager.db.signup.findOne({
      email: info.email
    });
    if (user && user._id) {
      let userObj = this.getFormatUserData(user);

      return this.jr.DBManager.db.user
        .save(userObj)
        .then(async (res) => {
          if (res && res._id) {
            // add email as the indexes
            return this.addIndexes(res);
          }
          return res;
        })
        .then((res) => {
          return this.removeSignupRecord(user);
        })
        .then((res) => {
          return res;
        });
    }
    return;
  }

  getFormatUserData(user) {
    return Object.assign(
      {},
      {
        email: user.email,
        username: user.username,
        password: user.password,
        region_details: user.region_details
      }
    );
  }

  async addIndexes(info) {
    let formatObj = {
      email: info.email,
      recordId: info._id ? info._id.toString() : ""
    };
    let indexes = this.jr.DBManager.db.indexes
      .findOne({
        email: info.email
      })
      .then((res) => {
        return res;
      });
    if (!indexes.email) {
      return this.jr.DBManager.db.indexes.save(formatObj).then((inxCreated) => {
        return inxCreated;
      });
    }
    return;
  }

  async resendOTP(req, res) {
    let otpData = req.body;
    let data = Object.assign({}, otpData);
    // every place need to refactor the req.body , all thing should come as params
    this.jr.OTPService.resend(otpData)
      .then((result) => {
        if (result.error) {
          res.send(result);
        } else {
          data = Object.assign({}, result);
          return this.jr.MailService.processMail(data, {});
        }
      })
      .then((mailSent) => {
        res.send({
          sentOTP: true,
          email: data.email,
          generated_count: data.generated_count,
          tokenId: data.tokenId
        });
      })
      .catch((e) => {
        console.log("error is : ", e);
        logger.error(e);
      });
  }

  async saveData(data) {
    return await this.jr.DBManager.db.signup.save(data);
  }

  async removeSignupRecord(data) {
    return await this.jr.DBManager.db.signup.removeOne({
      _id: data._id
    });
  }
}

module.exports = SignupService;
