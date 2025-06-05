// This is a standalone script running purely the log in a new terminal to keep a clean operating environment.

import chalk from 'chalk';
import blessed from 'neo-blessed';
import net from 'net';

const args = process.argv.slice(2);
const portArg = args.find(arg => arg.startsWith('--port='));
const port = portArg ? parseInt(portArg.split('=')[1], 10) : 5555;

const screen = blessed.screen({
                    smartCSR: true,
                    title: 'Arbitrage Program Log'
                });

const logBox = blessed.log({
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    label: 'Logs',
                    border: 'line',
                    style: {
                        border: { fg: 'cyan' }
                    },
                    //scrollable: true,
                    alwaysScroll: true,
                    scrollbar: {
                        ch: ' ',
                        inverse: true
                    }
                });

screen.append(logBox);
screen.key(['C-c'], () => process.exit(0));
screen.render();

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const input = data.toString().trim(),
          splitted = input.split(' ');

    const type = splitted[0],
          message = splitted.slice(1).join(' ')

    switch(type) {

      case 'success':
        logBox.log(chalk.green(message));
        screen.render();
      break;

      case 'error':
        logBox.log(chalk.red(message));
        screen.render();
      break;

      case 'process':
        logBox.log(chalk.yellow(message));
        screen.render();
      break;

      case 'exit':
        logBox.log(chalk.bgYellow(`Closing log UI...`));
        screen.render();
        setTimeout(() => {
          process.exit(0);
        }, 1500)
      break;
    }
  });
});

server.listen(port, () => {
  logBox.log(chalk.bgYellow(`Log UI running on port ${port}`));
  screen.render();
});