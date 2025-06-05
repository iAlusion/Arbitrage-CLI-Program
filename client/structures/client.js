import fs from 'fs';
import { pathToFileURL } from  'url';
import config from '../../config.json' with { type: 'json' };
import UILogger from './logger.js';
import net from 'net';


class Client {
    constructor(dirpath) {

        this.baseDir = dirpath;

        this.cmdDir = `${this.baseDir}/client/commands`;

        this.exDir = `${this.baseDir}/client/exchanges`;

        this.port = config.port || 5555;

        this.hasStarted = false;
        
        this.hasSetup = config.hasSetup;

        this.commands = new Map();

        this.exchanges = new Map();

        this.commandLogs = new Array();

        this.UILogger = new UILogger();

        this.tcp = null;

        fs.readdir(this.cmdDir, async (err, files) => {
            if(err) throw err;

            for(const file of files) {
                if(!file.endsWith('.js')) continue;
                    
                const { default: Command } = await import(pathToFileURL(`${this.cmdDir}/${file}`));
                const cmd = new Command(this);

                this.commands.set(cmd.name, cmd);
            }
        });

        fs.readdir(this.exDir, async (err, files) => {
            if(err) throw err;

            for(const file of files) {
                if(!file.endsWith('.js')) continue;
                    
                const { default: Exchange } = await import(pathToFileURL(`${this.exDir}/${file}`));
                const exchange = new Exchange(this);
                    if(!exchange.shouldSet) continue;
                console.log(exchange);
                this.exchanges.set(exchange.name, exchange);
            }
        });

    }

    async setCon() {
        const connection = await net.createConnection(this.port);

            this.tcp = connection;
        
        console.log(`Connection to UI Port open.`)

        return undefined;
    }

    sendCommand(toSend) {
        this.tcp.write(toSend);

        return undefined;
    }

    async runCommand(name, args = {}) {
        const command = this.commands.get(name);
            if(!command) throw new error('Command not found');

        await command.run(args);
        
        return undefined;
    }

}

export default Client;