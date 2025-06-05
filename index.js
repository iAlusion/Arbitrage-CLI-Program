#!/usr/bin/env node

//Import packages
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import path from 'path';

//Import arbi files
import Client from './client/structures/client.js';
import { infoText } from './client/structures/logger.js';

//Prepare OS based directory path
const filename = fileURLToPath(import.meta.url);
const directory = path.dirname(filename);


//Prepare client variable
let client = new Client(directory);

const allChoices = [
  { name: 'Setup(N/A)           - Setup to run once to install the program settings', value: 'setup'},
  { name: 'Start                - Starts the program', value: 'start' },
  { name: 'Update-setting(N/A)  - Updates a specified setting', value: 'update' },
  { name: 'Test', value: 'test', isCmd: true},
  { name: 'Status(N/A)          - Gives a status report on the program runtime', value: 'status' },
  { name: 'Stop                 - Stops the program running', value: 'stop'},
  new inquirer.Separator(),
  { name: 'Exit                 - Exits the program', value: 'exit' }
];

async function mainMenu() {
    process.stdout.write('\x1b]0;Arbitrage Program by iAlusion\x07');

  while (true) {
    console.clear();

    infoText();

    const filteredChoices = allChoices.filter(choice => {
        if(choice instanceof inquirer.Separator) return true
        if(choice.value === 'setup' && client.hasSetup) return false;
        if(!client.hasSetup && choice.value !== 'setup' && choice.value !== 'exit') return false;
        if(choice.value === 'start' && client.hasStarted) return false;
        if(choice.value === 'update' && (!client.hasSetup || client.hasStarted)) return false;
        if(choice.isCmd && !client.hasStarted) return false;

      return true;
    });

    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Select an action:',
      choices: filteredChoices,
    });

    await client.runCommand(action);


    // Pause before showing menu again so user sees the message
    await new Promise((res) => setTimeout(res, 1500));
  }
}

mainMenu();
