import Client from "./client/structures/client.js";
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const directory = path.dirname(filename);

const client = new Client(directory);

console.log(client);