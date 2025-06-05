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
          split = input.split(',');

    switch(split[0]) {

      case 'successLog':
        logBox.log(chalk.green(split[1]));
        screen.render();
      break;

      case 'errorLog':
        logBox.log(chalk.red(split[1]));
        screen.render();
      break;

      case 'processLog':
        logBox.log(chalk.yellow(split[1]));
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