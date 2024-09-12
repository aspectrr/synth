import { spawn } from 'node:child_process';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'node:fs';

const options = yargs(hideBin(process.argv)).usage("Usage: -i <package>").option("i", {
  alias: "package", describe: "The package you want to install", type: "string", demandOption: true
}).argv;

console.log("Hello" + options.package);
// Need to find the working directory where the package.json file
const workingDir = process.cwd();
console.log(workingDir);

const files = fs.readdirSync(workingDir)

let packageManager = "";

for (const file of files){
  console.log(file);
  switch(file) {
    case 'package-lock.json':
      packageManager = "npm";
      break;
    case 'pnpm-lock.yaml':
      packageManager = "pnpm";
      break;
    case 'bun.lockb':
      packageManager = 'bun';
      break;
    case 'yarn.lock':
      packageManager = "yarn";
      break;
    default:
      packageManager = "npm";
      break;
  }
}

console.log(packageManager);

const install = spawn(packageManager, ['install', 'uploadthing']);

// figure out what package manager this person users
//
//install.stdout.on('data', (data) => {
//  console.log(`stdout: ${data}`);
//});
//
//install.stderr.on('data', (data) => {
//  console.error(`stderr: ${data}`);
//});
//
//install.on('close', (code) => {
//  console.log(`child process exited with code ${code}`);
//});

// check for nextjs package and then check for the app and pages folder to look for a palce to add the pages components
// then log out the URL to go to it and try it out.
// if nextjs isnt installed then log out an error like "Sorry this only works on Next.JS at the moment!"
let typescriptUsed = false;
// i could also check the package.json file for typsecript as a dev dependency instead of iterating through the file list
for(const file of files) {
  if(file === 'tsconfig.json') {
    typescriptUsed = true;
  }
}

for(const file of files) {

 if(fs.lstat(file).isDirectory() && (file === 'app' || file === 'pages')){
   // first get the name of the directory if it exists
   const routerName = file;
   // check to make sure this doesn't overwrite any other file that is in the directory and make sure that tsx or jsx files exist 
   // check if there is a tsconfig.json file in the root directory
   const fileName = `uploadthing.${typescriptUsed ? 't': 'j'}sx`;
   const fileData = "";
   fs.writeFile(fileName,)
   break;
 } 
}
// I need to find out what package manager this project is using, npm, pnpm, yarn, bun, and install uploadthing with the respective packager manager
// Then make sure it installed
// I need to install uploadthing and then find out whether the next.js app is with pages or router, from there add in a page for uploadthing with some quick boilerplate. and that should be good
// future, i would like to add more verbose colors, logs, and options into what projects it can be added into and ofc more packages that it can install

