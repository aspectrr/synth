// stripe.js 
// I want to impliment stripe in a nextjs project, im going to work of their premade demos, what if i just did all their demos?
// ask if they want a. checkouts, checkouts plus users to have their own accounts, if so, find out what database they are using, whats the name of the user model that needs to have a 
// stripe account, then add a `stripeAccountId` field to store their account 
// checkouts should just be directing them to a stripe hosted page so that there is less code to write
// Thinking about what each website is selling, one time items, reoccuring, multiple items, items by user, variable priced items
// There is a lot to consider there, I could ask, are planning to sell 1. one time purchase items, 2. reocurring purchase items (subscriptions), 3. variable prices items
// Then ask Do you definetively know the number and what items you are planning to sell?
import { ensureAndAppendFile, ensureDirectoryExists, createProductPackage, waitForValidInput } from "./utils";
import open from 'open';

export async function stripeMarketplace(){

  open("https://dashboard.stripe.com/apikeys");
  console.log("Login or Sign Up for Stripe if you have never used it before!")
  console.log("After that, find your publishable and secret API keys in the developer dashboard!")
  const publishableKey = await waitForValidInput("What is your Stripe Publishable Key?", (input) => input.startsWith("pk"));
  const secretKey = await waitForValidInput("What is your Stripe Secret Key?", (input) => input.startsWith("sk"));
  ensureAndAppendFile(".env.local", `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${publishableKey}\nSTRIPE_SECRET_KEY=${secretKey}`);
  ensureAndAppendFile(".gitignore", ".env.local");
  ensureDirectoryExists("utils");
  ensureAndAppendFile("utils/stripe.ts", `import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export default function getStripe(): Promise<Stripe | null> {
  if (!stripePromise)
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
    );

  return stripePromise;
}

export function formatAmountForDisplay(
  amount: number,
  currency: string,
): string {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  return numberFormat.format(amount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string,
): number {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}`);
  ensureDirectoryExists("lib");
  ensureAndAppendFile("lib/stripe.ts", `import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2023-10-16"
})`);
  ensureDirectoryExists("config");
  ensureAndAppendFile("config/index.ts", `export const CURRENCY = "usd";
// Set your amount limits: Use float for decimal currencies and
// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
export const MIN_AMOUNT = 10.0;
export const MAX_AMOUNT = 5000.0;
export const AMOUNT_STEP = 5.0;`);
  ensureDirectoryExists("app/actions");
  let stripeCliAvailable = false;
  const stripeCliCheck = spawn("stripe", ["--version"]);
  stripeCliCheck.stdout.on('data', (data) => {
    stripeCliAvailable = true;
  });
  
  if(stripeCliAvailable){
    await spawn("stipe", ["login"]);
    const name = await waitForValidInput("What is the name of the product you want to sell?: ");
    const description = await waitForValidInput("What is the description of the product you want to sell?: ");
    const price = await waitForValidInput("What is the price of the product you want to sell?: ", (string) => !isNaN(string) && !isNaN(parseFloat(string)));
    const createProduct = await spawn("stripe", ["products", "create", `--name=${name}`, `--description=${description}`, `--default-price-data.currency=usd`, `--default-price-data.unit-amount=${price * 100}`])
    createProduct.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`); 
    });

    createProduct.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    createProduct.on('close', (code) => {
      console.log(`child process exited with code ${code}`);  
    });
  }

  ensureAndAppendFile("app/actions/stripe.ts", ``)
} 
