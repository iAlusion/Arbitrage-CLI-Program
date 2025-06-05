import CommandBase from '../structures/commandBase.js';
import { launchUI, handshakeUI } from '../structures/logger.js';
import { Socket } from 'net';
import chalk from 'chalk';

class Start extends CommandBase {
    constructor(client) {
        super(client, {
            name: 'start'
        });
    }

    async run() {
        console.log(chalk.yellow('🚀 Starting the program...'));
        console.log(chalk.yellow('Attempting to launch log terminal...'));
        await launchUI(this.client.port, this.client.baseDir);
        console.log(chalk.yellow('Attempting handshake with log terminal...'))
        await handshakeUI(this.client.port);
            this.client.UIISOpen = true;
        console.log('✅ Handshake successfull')
        console.log(chalk.green('Setting connection for IPC'));
        await this.client.setCon();
            if(this.client.tcp instanceof Socket) {
                console.log('✅ Connection sucessfully opened, program ready!')
                this.client.hasStarted = true;
            } else {
                console.error(chalk.red('❌ Connection not established, terminating program. Please try again or contact the developer on Discord.'))
                this.client.log('exit');
                process.exit()
            }
        
        console.log('Attempting to build exchanges...');
            this.client.buildExchanges();
        console.log('✅ Exchanges build successfully');

        return undefined;
    }
}

export default Start;