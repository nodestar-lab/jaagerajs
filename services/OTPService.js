class OTPService {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*OTPService] ");
  }

  async getOTP(userInfo) {
    let otp = this.generate();
    return this.save(otp, userInfo).then(res => {
      return {
        code: res.otp,
        tokenId: res._id,
        generated_count: res.generated_count
      };
    }).catch(err => {
      logger.error(err);
    });
  }

  generate() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async save(otp, userInfo) {
    let constructData = {
      email: userInfo.email,
      username: userInfo.username,
      otp: otp,
      created: new Date(),
      generated_count: 1,
      verified: false
    };
    return await this.jr.DBManager.db.otpstore.save(constructData);
  }

  async verify(info) {
    console.log("inside verify otp info is :  ", info);
    return this.jr.DBManager.db.otpstore
      .findById({
        _id: info.tokenId
      })
      .then(res => {
        console.log("after query in verify otp ", res.otp);
        if (res.otp === parseInt(info.otpCode)) {
          // add asynchrounus flow here also 
          // add check it is older then 15 min 
          // check otp used before  
          this.setVerified(info.tokenId);
          return {
            verfied: true,
            email: res.email
          };
        } else {
          return {
            error: {
              verfied: false,
              message: "wrong otp code please try again"
            }
          };
        }
      })
      .catch(err => {
        return {
          err: err.message,
          otherInfo: "unable to fetch the record"
        };
      });
  }

  async findOneRecord(id) {
    return this.jr.DBManager.db.otpstore
      .findById({
        _id: id
      })
      .then(res => {
        return res;
      })
  }

  async resend(info) {
    console.log("inside the resend otp function ", info);
    let error = {};
    let otp = this.generate();
    let record = await this.findOneRecord(info.tokenId);
    console.log("record : ", record);
    if (record) {
      if (record.generated_count >= 3) {
        // if time is after 1 day let them try for another 3 times , reset the count
        // check otp generation limit is exceeds 3 times . 
        error.message = `OTP is already generated 3 times`;
        return {
          error
        };
      }
      if (record.verfied) {
        // check record is verified or not
        error.message = `OTP already verified`;
        return {
          error
        };
      }
      return this.jr.DBManager.db.otpstore.updateOne({
        _id: info.tokenId
      }, {
        $inc: {
          generated_count: 1
        },
        otp: otp
      }).then(res => {
        return {
          code: otp,
          email: record.email,
          generated_count: record.generated_count + 1,
          username: record.username,
          tokenId: record._id
        };
      })
    } else {
      error.message = `No record found`;
      return {
        error
      };
    }
  }

  setVerified(id) {
    return this.jr.DBManager.db.otpstore.updateOne({
      _id: id
    }, {
      verified: true
    }).then(res => {
      return res;
    });
  }
}

module.exports = OTPService;