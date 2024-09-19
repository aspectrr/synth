#!/usr/bin/env node 

import { spawn } from 'node:child_process';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'node:fs';
import open from 'open';
import { appendToTopofFile, wrapStringinFile, ensureAndAppendFile, ensureDirectoryExists, waitForValidInput } from './utils.js';
import colors from 'colors';

const options = yargs(hideBin(process.argv)).usage("Usage: -i <package>").option("i", {
  alias: "package", describe: "The package you want to install", type: "string", demandOption: true
}).choices("i", ["uploadthing"]).help("help").argv;

console.log("Welcome to happy-monstera!".italic);
console.log("You are installing " + options.package.italic.red)
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


// [x] 1. Find the working directory of the process
// [x] 2. figure out what package manager is being used 
// [x] 3. install uploadthing from the used package manager 
// [x] 4. open up the browser and make the user go to uploadthing and get an API key and paste it into the CLI 
// [x] 5. figure out if the nextjs instance is using app/ or pages/
// [x] 6. if the directories don't exist, add them and make sure the files don't exist before adding them in, if they do add a delimiter
// [x] 7. Check if they are using typescript
// [x] 8. see if the user is using tailwind, if so wrap the tailwind config with the wrapper
// [x] 9. ask if the user wants to use the SSR plugin for the upload button
// [x] 10. print that the CLI is done!
// [x] 11. open up the browser to the uploadthing page to try out
// [] optional 12. make it super easy to remove too, like a remove function that removes everything that we did.
// [] add in integration for src/ directory 
// I'm thinking something like a abs path reference and adding it in front of /app or /server if it is used
// also a way to stop people from using this manager if this isnt a nextjs project
// get the alias from the tsconfig/jsconfig file 

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
console.log("Opening ".bold + options.package.italic.red + " sign-in page".bold)
open('https://uploadthing.com/sign-in');

const condition = (input) => {
  return input.startsWith('sk_live_');
}

const secretKey = await waitForValidInput(`Please enter your ${options.package} secret key: `, condition);
// console.log("Secret Key: ", secretKey);
// check for nextjs package and then check for the app and pages folder to look for a palce to add the pages components
// then log out the URL to go to it and try it out.
// if nextjs isnt installed then log out an error like "Sorry this only works on Next.JS at the moment!"
let tailwindUsed = false;
let typescriptUsed = false;
let pathAlias = "~";
// i could also check the package.json file for typsecript as a dev dependency instead of iterating through the file list
for(const file of files) {
  if(file === 'tsconfig.json') {
    typescriptUsed = true;
    console.log('Found TypeScript in your project');
    fs.readFile(file,'utf8', (err,data) =>{
      const jsonData = JSON.parse(data);
      pathAlias = Object.keys(jsonData.compilerOptions.paths)[0].split('/')[0];
    })
  } else if(file === 'jsconfig.json'){
    fs.readFile(file,'utf8', (err,data) =>{
      const jsonData = JSON.parse(data);
      pathAlias = Object.keys(jsonData.compilerOptions.paths)[0].split('/')[0];
    })
  }
  //console.log(pathAlias);
  if(file === 'tailwind.config.ts' || file === 'tailwind.config.js'){
    tailwindUsed = true;
    console.log("Found Tailwind config in your project")
  }
}

// add in .env the env variable 
// make a function to make sure directories exist and that the file doesnt exist.
// make the CLI open up the sign up screen, make them finish up on the browser and then take the .env variable back to the 
// CLI or ask for it as input


// for the tailwind config file, what if I figure out what it is exporting and wrap that in with the 
// withUt function and also import it in the top of the file.

// see if tailwind exists in the project, use that to decide which files it adds in 
// wrap the tailwind file
// and then something to ask if the users wants to use the SSR plugin instead
let routerName
for(const file of files) {
 if(fs.lstatSync(file).isDirectory() && (file === 'app' || file === 'pages')){
   // first get the name of the directory if it exists
   routerName = file;
   // check to make sure this doesn't overwrite any other file that is in the directory and make sure that tsx or jsx files exist 
   // check if there is a tsconfig.json file in the root directory
 }
}

ensureAndAppendFile('.env.local', `UPLOADTHING_SECRET=${secretKey}`);

const ssrCondition = (input) => {
  return ["y", "yes"].includes(input.toLowerCase()) || ["n", "no"].includes(input.toLowerCase());
}

const ssrUsed = await waitForValidInput("Would you like to impliment SSR for UploadThing? [y/n]: ", ssrCondition);

if(routerName === 'app'){
  ensureDirectoryExists('app/api/uploadthing');
  ensureAndAppendFile(`app/api/uploadthing/core.${typescriptUsed ? 't' : 'j'}s`, `import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as ${`metadata`}
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside ${`onClientUploadComplete`} callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
`);
  ensureAndAppendFile(`app/api/uploadthing/route.${typescriptUsed ? 't': 'j'}s`, `import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
`);
  ensureDirectoryExists('utils');
  ensureAndAppendFile(`utils/uploadthing.${typescriptUsed ? 't' : 'j'}s`, `import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "${pathAlias}/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
`);
  ensureDirectoryExists('app/example-uploader');
  ensureAndAppendFile(`app/example-uploader/page.${typescriptUsed ? 't' : 'j'}sx`, `"use client";

import { UploadButton } from "${pathAlias}/utils/uploadthing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert("ERROR! " + error.message);
        }}
      />
    </main>
  );
}
`);
if(tailwindUsed){
  appendToTopofFile(`tailwind.config.${typescriptUsed ? 't' : 'j'}s`, 'import { withUt } from "uploadthing/tw";\n')
  wrapStringinFile(`tailwind.config.${typescriptUsed ? 't' : 'j'}s`, "withUt(", "config", ")");
} else {
  appendToTopofFile(`app/layout.${typescriptUsed ? 'j' : 't' }sx`,`import "@uploadthing/react/styles.css";
`)
}
if(ssrUsed){
    appendToTopofFile(`app/layout.${typescriptUsed ? 't': 'j'}sx`,`import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "${pathAlias}/app/api/uploadthing/core";\n`)
    wrapStringinFile(`app/layout.${typescriptUsed ? 't': 'j'}sx`, `<NextSSRPlugin
          /**
           * The ${`extractRouterConfig`} will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch ${`/api/uploadthing`} directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />\n`,"{children}","")
  }
} else {
  ensureDirectoryExists('server');
  ensureAndAppendFile(`server/uploadthing.${typescriptUsed ? 't': 'j'}s`, `import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
      // This code runs on your server before upload
      const user = await auth(req, res);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as ${`metadata`}
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside ${`onClientUploadComplete`} callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
`);
  ensureDirectoryExists(`pages/api/uploadthing.${typescriptUsed ? 't': 'j'}s`, `import { createRouteHandler } from "uploadthing/next-legacy";

import { ourFileRouter } from "${pathAlias}/server/uploadthing";

export default createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
`);
  ensureDirectoryExists('utils');
  ensureAndAppendFile(`utils/uploadthing.${typescriptUsed ? 't': 'j'}s`, `import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "${pathAlias}/server/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
`);
if(tailwindUsed){
  appendToTopofFile(`tailwind.config.${typescriptUsed ? 't' : 'j'}s`, 'import { withUt } from "uploadthing/tw";\n')
  wrapStringinFile(`tailwind.config.${typescriptUsed ? 't' : 'j'}s`, "withUt(", "config", ")");
} else {
  appendToTopofFile(`app/layout.${typescriptUsed ? 'j' : 't' }sx`,`import "@uploadthing/react/styles.css";
`)
}
ensureAndAppendFile(`pages/example-uploader.${typescriptUsed ? 't' : 'j'}sx`, `import { UploadButton } from "${pathAlias}/utils/uploadthing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert("ERROR! " + error.message);
        }}
      />
    </main>
  );
}
`)
}

console.log("Installation is complete!".bold.green);

const dev = spawn(packageManager, ['run', 'dev']);

dev.stdout.on('data', (data) => {
  console.log(data.toString());
});

dev.stderr.on('data', (data) => {
  console.error(data.toString());
});

setTimeout(() => {
  open("http://localhost:3000/example-uploader");
}, 5000)
