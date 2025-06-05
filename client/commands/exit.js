import CommandBase from '../structures/commandBase.js';

class Exit extends CommandBase {
    constructor(client) {
        super(client, {
            name: 'exit'
        });
    }

    async run() {
        console.log('👋 Exiting program. Goodbye!');
        if(this.client.UIIsOpen) {
            this.client.tcp.write('exit');
            this.client.tcp.end();
        }
            setTimeout(() => {
                console.clear();
                process.exit(0);
            }, 1500)
        return undefined;
    }
}

export default Exit;