import createHttpError from "http-errors";
import uniqid from "uniqid";
import { getProducts, writeProducts } from "../fs/tools.js";

export const saveNewReview = async (productId, newReviewData) => {
  const products = await getProducts();
  const index = products.findIndex((product) => product.id === productId);

  if (index !== -1) {
    products[index].reviews.push({
      ...newReviewData,
      id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await writeProducts(products);
    return products[index];
  } else {
    return null;
  }
};

export const findReviews = async () => {};

export const findReviewById = async () => {};

export const findReviewByIdAndUpdate = async () => {};

export const findReviewByIdAndDelete = async (productId, reviewId) => {
  const products = await getProducts();
  const index = products.findIndex((product) => product.id === productId);

  if (index !== -1) {
    const reviewIndex = products[index].reviews.findIndex(
      (review) => review.id === reviewId
    );
    if (reviewIndex !== -1) {
      products[index].reviews = products[index].reviews.filter(
        (review) => review.id !== reviewId
      );
      await writeProducts(products);
      return products[index].reviews;
    } else {
      throw new createHttpError(404, `Review with id ${reviewId} not found!`);
    }
  } else {
    throw new createHttpError(404, `Product with id ${productId} not found!`);
  }
};
