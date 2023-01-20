import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    reviews: [
      {
        comment: { type: String, required: true },
        rate: { type: Number, required: true, min: 1, max: 5 },
        updatedAt: { type: Date, required: true },
        createdAt: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true, // this option automatically the createdAt and updatedAt fields
  }
);

export default model("Product", productsSchema); // this model is now automagically linked to the "products" collection, if collection is not there it will be created
