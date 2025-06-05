import fs from 'fs';
import { fileURLToPath, pathToFileURL } from  'url';
import config from '../../config.json' with { type: 'json' };
import net from 'net';


class Client {
    constructor(dirpath) {

        this.baseDir = dirpath;

        this.cmdDir = `${this.baseDir}/client/commands`;

        this.exDir = `${this.baseDir}/client/exchanges`;

        this.port = config.port;

        this.hasStarted = false;
        
        this.hasSetup = config.hasSetup;

        this.UIIsOpen = false;

        this.commands = new Map();

        this.exchanges = new Map();

        this.commandLogs = new Array();

        this.tcp = null;

        fs.readdir(this.cmdDir, async (err, commands) => {
            if(err) throw err;

            for(const command of commands) {
                const { default: Command } = await import(pathToFileURL(`${this.cmdDir}/${command}`));
                const cmd = new Command(this);

                this.commands.set(cmd.name, cmd);
            }
        });
    }

    async buildExchanges() {
        if(!config.exchanges || !Array.isArray(config.exchanges) || config.exchanges == 0) {
            this.cancelBuild(`Attempted to build exchanges for the program which failed due to configured exchanges either doesn't exist, is not an array or is an empty array.`);
            return undefined;
        }

        const existingExchanges = fs.readdirSync(this.exDir);

            for(const exchange of config.exchanges) {
                if(!existingExchanges.includes(`${exchange}.js`)) {
                    this.cancelBuild(`Attempted to build ${exchange} which does not exist in the build tree.`);
                    break;
                }

                const { default: exchangeFile } = await import(fileURLToPath(`${this.exDir}/${exchange}.js`)),
                    buildExchange = new exchangeFile(this);

                this.exchanges.set(buildExchange.name, buildExchange);

                this.log('process', `Build ${exchange} to memory`)
            }
    }

    cancelBuild(reason) {
        this.log('error', reason);

        return undefined;
        //Prompt setup
    }

    async setCon() {
        const connection = await net.createConnection(this.port);

            this.tcp = connection;
        
        console.log(`Connection to UI terminal made.`)

            this.log('success', 'Connection to UI terminal from host has been established')

        return undefined;
    }

    log(type, message) {

        this.tcp.write(`${type} ${message}`);

        return undefined;
    }

    async runCommand(name, args = {}) {
        const command = this.commands.get(name);
            if(!command) {
                if(this.UIIsOpen) this.log('error', `Command: ${name} was not found. Please report this bug to the developer.`);
                return undefined;
            }
                await command.run(args);
                if(this.UIIsOpen) this.log('success', `Command: ${name} was succesfully ran`);
        
        return undefined;
    }

    storeSetting() {

    }

    storeWallet() {
        
    }
}

export default Client;