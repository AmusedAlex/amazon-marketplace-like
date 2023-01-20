import express from "express";
import createHttpError from "http-errors";
import ProductsModel from "./model.js";

const { NotFound } = createHttpError;

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsModel(req.body);
    // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
    // if it is ok the product is not saved yet
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.find();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId).populate(
      "reviews"
    ); // .populate({path:"reviews"}) 2nd version

    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productId, // WHO you want to modify
      req.body, // HOW you want to modify
      { new: true, runValidators: true } // options. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly updated record you shall use new:true
      // By default validation is off in the findByIdAndUpdate --> runValidators:true
    );

    // ****** ALTERNATIVE METHOD ******
    /*     const product = await ProductsModel.findById(req.params.productId)
    // When you do a findById, findOne,.... you get back a MONGOOSE DOCUMENT which is NOT a normal object
    // It is an object with superpowers, for instance it has the .save() method that will be very useful in some cases
    product.age = 100
    await product.save() */

    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(
      req.params.productId
    );

    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// **************** REVIEWS *******************

productsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const reviewToInsert = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productId, // WHO
      { $push: { reviews: reviewToInsert } }, // HOW
      { new: true, runValidators: true } // OPTIONS
    );

    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      res.send(product.reviews);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      const review = product.reviews.find(
        (review) => review._id.toString() === req.params.reviewId
      );

      if (review) {
        res.send(review);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      const index = product.reviews.findIndex(
        (review) => review._id.toString() === req.params.reviewId
      );

      if (index !== -1) {
        product.reviews[index] = {
          ...product.reviews[index].toObject(),
          ...req.body,
          updatedAt: new Date(),
        };
        await product.save();
        res.send(product);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        req.params.productId, // WHO
        { $pull: { reviews: { _id: req.params.reviewId } } }, // HOW
        { new: true }
      );
      if (updatedProduct) {
        res.send(updatedProduct);
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.productId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
