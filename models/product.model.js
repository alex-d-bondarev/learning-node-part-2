import mongoose from "mongoose";
import {addCommonVirtuals} from "../helpers/mongoose-plugin.js";

const productSchema = new mongoose.Schema({
        title: {
            type: String,
            required: [true],
            trim: true,
            minlength: [2],
            maxLength: [100]
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "categoryNameValidation"],
            ref: "Category",
        },

        price: {
            type: Number,
            required: [true],
            min: [0, "minPriceValidation"],
        },

        description: {
            type: String,
            required: [true, "mandatoryDescriptionValidation"],
            trim: true,
            minlength: [5, "descriptionNameMinLength"],
            maxLength: [255, "descriptionNameMaxLength"],
        },

        images: {
            type: [String],
            required: [true, "mandatoryImagesValidation"],
        },

        countInStock: {
            type: Number,
            default: 0,
            required: false,
            min: [0, "minCountInStockValidation"],
            max: [99999, "maxCountInStockValidation"],
        },

        rating: {
            average: {
                type: Number,
                default: 5,
                min: [0, "minRatingValidation"],
                max: [5, "maxRatingValidation"],
            },
            count: {
                type: Number,
                default: 0,
                min: [0, "minRatingCountValidation"],
            }
        },

        views: {
            type: Number,
            default: 0,
            min: [0, "minViewsValidation"],
        }
    },

    {
        timestamps: true,
    })

productSchema.plugin(addCommonVirtuals)

export const ProductModel = mongoose.model("Product", productSchema)
