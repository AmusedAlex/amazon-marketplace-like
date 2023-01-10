import fs from "fs-extra";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const { readJSON, writeJSON, writeFile, unlink } = fs;

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/products.json"
);
console.log("🚀productsJSONPath", productsJSONPath);
const publicFolderPath = join(process.cwd(), "./public/img/products");

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPath, productsArray);

export const saveProductsPictures = (fileContentAsABuffer, filename) =>
  writeFile(join(publicFolderPath, filename), fileContentAsABuffer);

export const deleteProductsPicture = (imageUrl) =>
  unlink(join(publicFolderPath, "../../", imageUrl));
