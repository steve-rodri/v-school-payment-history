import fs from "fs";

const storageDir = "./storage";
const distDir = "./dist";

export const createDirectories = () => {
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir);
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
};
