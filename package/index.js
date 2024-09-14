import { spawn } from 'node:child_process';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'node:fs';
import readline from 'node:readline';
import open from 'open';

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


// [x] 1. Find the working directory of the process
// [x] 2. figure out what package manager is being used 
// [x] 3. install uploadthing from the used package manager 
// [x] 4. open up the browser and make the user go to uploadthing and get an API key and paste it into the CLI 
// [] 5. figure out if the nextjs instance is using app/ or pages/
// [] 6. if the directories don't exist, add them and make sure the files don't exist before adding them in, if they do add a delimiter
// [] 7. Check if they are using typescript
// [] 8. see if the user is using tailwind, if so wrap the tailwind config with the wrapper
// [] 9. ask if the user wants to use the SSR plugin for the upload button
// [] 10. print that the CLI is done!
// [] 11. open up the browser to the uploadthing page to try out
// [] optional 12. make it super easy to remove too, like a remove function that removes everything that we did.


console.log(`Found ${packageManager} as your package manager!`);

const install = spawn(packageManager, [packageManager === 'npm' ? 'install' : 'add', 'uploadthing','@uploadthing/react']);

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
open('https://uploadthing.com/sign-in');

let secretKey = ""
while(!secretKey.startsWith('sk_live_')){

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question("What's your uploadthing secret key?", key => {
  if(!key.startsWith('sk_live_')){
    console.log('Your secret key should start with sk_live_')
  }
  secretKey = key;
  rl.close()
})
}
// check for nextjs package and then check for the app and pages folder to look for a palce to add the pages components
// then log out the URL to go to it and try it out.
// if nextjs isnt installed then log out an error like "Sorry this only works on Next.JS at the moment!"
let typescriptUsed = false;
// i could also check the package.json file for typsecript as a dev dependency instead of iterating through the file list
for(const file of files) {
  if(file === 'tsconfig.json') {
    typescriptUsed = true;
    console.log('Found TypeScript in your project')
  }
}

function ensureDirectoryExists(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created or already exists: ${dirPath}`);
  } catch (error) {
    console.error(`Error creating directory: ${error.message}`);
  }
}

function ensureAndAppendFile(filePath, content) {
  try {
    // Check if the file exists
    fs.accessSync(filePath);
    console.log('File exists. Proceeding to write to it.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('File does not exist. It will be created.');
    } else {
      throw error; // Re-throw if it's not a "file does not exist" error
    }
  }

  // Write to the file (creates it if it does not exist)
  fs.appendFile(filePath, content, 'utf8', (err) => {
  if (err) {
    console.error('Error appending to file:', err.message);
  } else {
    console.log('Data appended successfully.');
  }
});
}

// add in .env the env variable 
// make a function to make sure directories exist and that the file doesnt exist.
// make the CLI open up the sign up screen, make them finish up on the browser and then take the .env variable back to the 
// CLI or ask for it as input

// see if tailwind exists in the project, use that to decide which files it adds in 
// wrap the tailwind file
// and then something to ask if the users wants to use the SSR plugin instead

let envFileExists = false;

for(const file of files) {
 if(fs.lstat(file).isDirectory() && (file === 'app' || file === 'pages')){
   // first get the name of the directory if it exists
   const routerName = file;
   // check to make sure this doesn't overwrite any other file that is in the directory and make sure that tsx or jsx files exist 
   // check if there is a tsconfig.json file in the root directory
   const fileName = `uploadthing.${typescriptUsed ? 't': 'j'}sx`;
 }
}

ensureAndAppendFile('.env.local', `UPLOADTHING_SECRET=${secretKey}`)

if(routerName === 'app'){
  ensureDirectoryExists('/app/api/uploadthing');
} else {
  ensureDirectoryExists('/server');
}
// I need to find out what package manager this project is using, npm, pnpm, yarn, bun, and install uploadthing with the respective packager manager
// Then make sure it installed
// I need to install uploadthing and then find out whether the next.js app is with pages or router, from there add in a page for uploadthing with some quick boilerplate. and that should be good
// future, i would like to add more verbose colors, logs, and options into what projects it can be added into and ofc more packages that it can install

