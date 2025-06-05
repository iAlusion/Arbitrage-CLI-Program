import CommandBase from '../structures/commandBase.js';

class Status extends CommandBase {
    constructor(client) {
        super(client, {
            name: 'status'
        });
    }

    async run() {
        console.log('📊 System status: Running');

        return undefined;
    }
}

export default Status;