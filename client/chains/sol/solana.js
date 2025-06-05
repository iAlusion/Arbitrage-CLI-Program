import ExchangeBase from "../../structures/exchangeBase.js";
import { Keypair, Connection, VersionedTransaction } from '@solana/web3.js';
import config from '../../../config.json' with { type: 'json' };

class Solana extends ExchangeBase {
    constructor(options) {
        super(options);

        this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

        this.vt = VersionedTransaction;
    }

    createWallet() {

    }

    loadWallet() {
        const secretKey = Uint8Array.from(config.solKey);
            return Keypair.fromSecretKey(secretKey);
    }
}

export default Solana;