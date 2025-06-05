import ExchangeBase from '../structures/exchangeBase.js';

class Mexc extends ExchangeBase {
    constructor() {
        super({
            name: 'mexc',
            shouldSet: false,
            requireCCXT: true
        });

        this.exchange = new this.ccxt.pro.mexc({
            apiKey: 'mx0vglHBqZsRdLDiVy',
            secret: '91de9ab9fd394908a2ebe4d0707b7c67' //not a working key for the people drooling to steal funds ;)
        });

        this.exchange.loadMarkets();
    }
}

export default Mexc;