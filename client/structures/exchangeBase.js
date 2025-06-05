import ccxt from 'ccxt';

class ExchangeBase {
    constructor(options) {

        this.name = options.name;

        this.api_key = options.api_key || undefined;

        this.shouldSet = options.shouldSet !== false;

        if(options.requireCCXT && options.requireCCXT === true) this.ccxt = ccxt;

    }

    multiWatch() {

    }
}

export default ExchangeBase;