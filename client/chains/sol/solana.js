import ExchangeBase from "../../structures/exchangeBase.js";
import { Keypair, Connection, VersionedTransaction } from '@solana/web3.js';
import config from '../../../config.json' with { type: 'json' };

class Solana extends ExchangeBase {
    constructor(client, options) {
        super(client, options);

        this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

        this.vt = VersionedTransaction;

        this.wallet;
    }

    createWallet() {
        const keypair = Keypair.generate();
        
            this.client.log('success', `Solana wallet created. `)

                this.wallet = keypair;

            return {
                keypair,
                publicAddress: keypair.publicKey.toBase58()
            }
    }

    loadWallet() {
        const secretKey = Uint8Array.from(config.solKey);
            return Keypair.fromSecretKey(secretKey);
    }
}

export default Solana;