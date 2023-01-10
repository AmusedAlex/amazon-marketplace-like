import { getProducts } from "../fs/tools";
import uniqid from "uniqid";

export const saveNewProduct = async (newProductData) => {
  const products = await getProducts();

  const newProduct = {
    ...newProductData,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
};
