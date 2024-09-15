import fs from 'node:fs';

export function appendToTopofFile(file, string){
  // Read the existing file contents
fs.readFile(file, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Combine the new text with the existing contents
  const updatedContent = string + data;

  // Write the updated content back to the file
  fs.writeFile(file, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File updated successfully!');
  });
});
}

export function wrapStringinFile(file, beforeString, stringtoFind, afterString){
  // Read the existing file contents
fs.readFile(file, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Find the position of the search string
  const index = data.lastIndexOf(stringtoFind);
  if (index === -1) {
    console.log('Search string not found in the file.');
    return;
  }
  // Insert the text before and after the search string
  const before = data.slice(0, index);
  const target = data.slice(index, index + stringtoFind.length);
  const after = data.slice(index + stringtoFind.length);
  
  const updatedContent = before + beforeString + target + afterString + after;

  // Write the updated content back to the file
  fs.writeFile(file, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File updated successfully!');
  });
});
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

  // Write to the file (creates it if it does not exist)
  fs.appendFile(filePath, content, 'utf8', (err) => {
  if (err) {
    console.error('Error appending to file:', err.message);
  } else {
    console.log('Data appended successfully.');
  }
});
}

export function waitForValidInput(prompt, condition) {
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
