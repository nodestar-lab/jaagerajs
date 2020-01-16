class PaymentGateway {
  constructor(config, jr) {
    this.config = config;
    this.jr = jr;
    logger.info("[*PaymentGateway] ");
  }
}
module.exports = PaymentGateway;