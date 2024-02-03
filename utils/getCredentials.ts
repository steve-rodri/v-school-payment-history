import fs from "fs";
import readlineSync from "readline-sync";
import { BASE_URL } from "../constants";

const CREDENTIALS_PATH = "./storage/credentials.json";

export type Credentials = {
  email: string;
  password: string;
};

export const getCredentials = (): Credentials => {
  let email = "";
  let password = "";

  // Check if credentials file exists
  if (fs.existsSync(CREDENTIALS_PATH)) {
    const { email: storedEmail, password: storedPassword } = JSON.parse(
      fs.readFileSync(CREDENTIALS_PATH, "utf-8"),
    );
    if (storedEmail && storedPassword) {
      console.log("Using stored email and password.");
      email = storedEmail;
      password = storedPassword;
    }
  }

  // Prompt user for email and password if not stored
  if (!email || !password) {
    console.log(`Enter the Credentials you use to login to ${BASE_URL}...`);
    email = readlineSync.question("Email: ");
    password = readlineSync.question("Password: ", {
      hideEchoBack: true,
    });
    fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify({ email, password }));
  }

  return { email, password };
};
