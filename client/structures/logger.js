import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import net from 'net';
import chalk from 'chalk';

export function launchUI(port, directory) {
    return new Promise((resolve, reject) => {
        const UI = path.join(directory + '/client/logger/logUI.js');
        const platform = os.platform();

        let terminalCommand;

        if (platform === 'win32') {
            terminalCommand = spawn('cmd.exe', [
                '/c',
                'start',
                'powershell.exe',
                'node',
                UI,
                `--port=${port}`
            ], {
                cwd: process.cwd(),
                detached: true,
                shell: true,
                stdio: 'ignore',
            });
        } else if (platform === 'darwin') {
            terminalCommand = spawn('osascript', [
                '-e',
                `tell application "Terminal" to do script "node '${UI}' --port=${port}; exit"`
            ]);
        } else if (platform === 'linux') {
            terminalCommand = spawn('gnome-terminal', ['--', 'bash', '-c', `node '${UI}' --port=${port}; exec bash`]);
        } else {
            console.error('Unsupported OS for launching terminal UI.');
            reject(false);
        }

        terminalCommand.on('error', (err) => {
        console.error('❌ Failed to launch terminal:', err);
        });

        console.log(chalk.green('✅ UI launch command success for:', platform));
        resolve(true);
    })
}

export function handshakeUI(port, retries = 10, delay = 500) {
    return new Promise((resolve, reject) => {
        const attempt = () => {
            const socket = net.connect(port, '127.0.0.1', () => {
                socket.end();
                resolve(true);
            });

            socket.on('error', () => {
                if (--retries === 0) return reject(new Error('Log UI server did not start in time'));
                setTimeout(attempt, delay);
            });
        };
        attempt();
    });
}

export function infoText() {
    console.log(chalk.blue("Alusions's Arbitrage Program"))
}