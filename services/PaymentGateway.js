class PaymentGateway{
    constructor(config, jr){
        this.config = config;
        this.jr = jr;
        console.log("[--] PaymentGateway");
    }
} 
module.exports = PaymentGateway;