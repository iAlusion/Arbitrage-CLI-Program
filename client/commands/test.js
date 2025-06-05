import CommandBase from '../structures/commandBase.js';

class Test extends CommandBase {
    constructor(client) {
        super(client, {
            name: 'test'
        });
    }

    async run() {
        this.client.log('success', 'Tested IPC connection woohoo');

        return undefined;
    }
}

export default Test;