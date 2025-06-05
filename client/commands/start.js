import CommandBase from '../structures/commandBase.js';
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
        await this.client.UILogger.launchUI(this.client.port, this.client.baseDir);
        console.log(chalk.yellow('Attempting handshake with log terminal...'))
        await this.client.UILogger.handshakeUI(this.client.port);
        console.log('✅ Handshake successfull')
        console.log(chalk.green('Setting connection for IPC'));
        await this.client.setCon();
            if(this.client.tcp instanceof Socket) {
                console.log('✅ Connection sucessfully opened, program ready!')
                this.client.hasStarted = true;
            } else {
                console.error(chalk.red('❌ Connection not established, terminating program. Please try again or contact the developer on Discord.'))
                this.client.sendCommand('exit');
                process.exit()
            }

        return undefined;
    }
}

export default Start;