import CommandBase from '../structures/commandBase.js';

class Test extends CommandBase {
    constructor(client) {
        super(client, {
            name: 'test'
        });
    }

    async run() {
        this.client.sendCommand('successLog,successfully passed this');

        return undefined;
    }
}

export default Test;