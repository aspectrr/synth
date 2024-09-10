import { spawn } from 'node:child_process';
import yargs from 'yargs';

const options = yargs.usage("Usage: -i <package>").option("i", {
  alias: "package", describe: "The package you want to install", type: "string", demandOption: true
}).argv;

console.log("Hello" + options.package);

const install = spawn('npm', ['install', 'uploadthing']);

install.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

install.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

install.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// I need to find out what package manager this project is using, npm, pnpm, yarn, bun, and install uploadthing with the respective packager manager
// Then make sure it installed
// I need to install uploadthing and then find out whether the next.js app is with pages or router, from there add in a page for uploadthing with some quick boilerplate. and that should be good
// future, i would like to add more verbose colors, logs, and options into what projects it can be added into and ofc more packages that it can install

