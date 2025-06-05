import Solana from '../chains/sol/solana.js';
 
class Jupiter extends Solana {
    constructor(client) {
        super(client,
        {
            name: 'jupiter',
            requireCCXT: false
        });

    }

    async getQuote(inputMint, outputMint, amount, slippage = 20) {
        const url = `https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippage}`,
              res = await fetch(url),
              data = await res.json();

              this.client.log('success', data);

        return data;
    }

    async getSwapTransaction(wallet, quote) {
        const res = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quote,
                userPublicKey: wallet.publicKey.toBase58()
            })
        });

        const data = await res.json();
        
        return Buffer.from(data.swapTransaction, 'base64');
    }

    async swap(wallet, quote) {
        const txBuffer = await this.getSwapTransaction(quote, wallet),
              transaction = this.vt.deserialize(txBuffer);

        transaction.sign([wallet]);

        const tser = transaction.serialize();

        const txid = await this.connection.sendRawTransaction(tser);

        console.log(`Swap successful: https://solscan.io/tx/${txid}`);
    }
}

export default Jupiter;