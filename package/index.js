import { spawn } from 'node:child_process';
import yargs from 'yargs';

const options = yargs.usage("Usage: -i <package>").option("i", {
  alias: "package", describe: "The package you want to install", type: "string", demandOption: true
}).argv;

console.log("Hello" + options.package);


