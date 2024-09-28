import fs from 'node:fs';
import readline from 'node:readline';

export function appendToTopofFile(file, string) {
  console.log("Appending to ", file);

  // Read the existing file contents asynchronously
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
  console.error('Error reading file:', err);
      return;
    }

    // Combine the new text with the existing contents
    const updatedContent = string + data;

    // Write the updated content back to the file asynchronously
  fs.writeFile(file, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log(`${file}: File updated successfully!`);
    });
  });
}


export function wrapStringinFile(file, beforeString, stringToFind, afterString) {
  try {
    // Read the existing file contents
    const data = fs.readFileSync(file, 'utf8');
    
    // Find the position of the search string
    const index = data.lastIndexOf(stringToFind);
    if (index === -1) {
      console.log('Search string not found in the file.');
      return;
    }
    
    // Insert the text before and after the search string
    const before = data.slice(0, index);
    const target = data.slice(index, index + stringToFind.length);
    const after = data.slice(index + stringToFind.length);
    
    const updatedContent = before + beforeString + target + afterString + after;
    
    // Write the updated content back to the file
    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`${file}: File updated successfully!`);
  } catch (err) {
    console.error('Error reading or writing file:', err);
  }
}

export function ensureDirectoryExists(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created or already exists: ${dirPath}`);
  } catch (error) {
    console.error(`Error creating directory: ${error.message}`);
  }
}

export function ensureAndAppendFile(filePath, content) {
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

  try {
    // Append to the file (creates it if it does not exist)
    fs.appendFileSync(filePath, content, 'utf8');
    console.log(`${filePath}: Data appended successfully.`);
  } catch (err) {
    console.error('Error appending to file:', err.message);
  }
}

export function waitForValidInput(prompt, condition) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    // Define the recursive function to ask for input
    function askQuestion() {
      rl.question(prompt, (input) => {
        if (condition(input)) {
          // If input matches the condition, resolve the promise
          resolve(input);
          rl.close(); // Close the readline interface
        } else {
          console.log('Invalid input, please try again.');
          askQuestion(); // Ask again
        }
      });
    }

    askQuestion(); // Start asking the question
  });
}

export function installPackage(packageName){
  // Need to find the working directory where the package.json file
const workingDir = process.cwd();
// console.log(workingDir);

const files = fs.readdirSync(workingDir)

// if src folder exists then need to just move everything into that directory, dont know how ill deal 
// with that, maybe make have a src files variable to check for src and where I can access the real app



let packageManager = "";

for (const file of files){
  //console.log(file);
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

console.log(`Found ${packageManager} as your package manager!`.bold);

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
//
}

