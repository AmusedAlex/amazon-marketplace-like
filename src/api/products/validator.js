import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const postSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a String.",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a String.",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is a mandatory field and needs to be a String.",
    },
  },
  imageUrl: {
    in: ["body"],
    isString: {
      errorMessage:
        "imageUrl is a mandatory field. Please supply a URL to an image.",
    },
  },
  price: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Price is a mandatory field and needs to be a number.",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a String.",
    },
  },
};

export const checksPostSchema = checkSchema(postSchema);

export const triggerBadRequest = (req, res, next) => {
  // 1. Check if previous middleware ( checksPostsSchema) has detected any error in req.body
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    // 2.1 If we have any error --> trigger error handler 400
    next(
      createHttpError(400, "Errors during blogPost validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    // 2.2 Else (no errors) --> normal flow (next)
    next();
  }
};

// VALIDATION CHAIN 1. checksBlogPostsSchema --> 2. triggerBadRequest
