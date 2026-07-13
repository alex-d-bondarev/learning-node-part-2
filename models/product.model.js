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
            required: [true, req.t("categoryNameValidation")],
            ref: "Category",
        },

        price: {
            type: Number,
            required: [true],
            min: [0, req.t("minPriceValidation")],
        },

        description: {
            type: String,
            required: [true, req.t("mandatoryDescriptionValidation")],
            trim: true,
            minlength: [5, req.t("descriptionNameMinLength")],
            maxLength: [255, req.t("descriptionNameMaxLength")],
        },

        // images: {
        //     type: [String],
        //     required: [true, req.t("mandatoryImagesValidation")],
        // },

        countInStock: {
            type: Number,
            required: [true, req.t("mandatoryCountInStockValidation")],
            min: [0, req.t("minCountInStockValidation")],
            max: [99999, req.t("maxCountInStockValidation")],
            default: 0,
        },

        rating: {
            average: {
                type: Number,
                default: 5,
                min: [0, req.t("minRatingValidation")],
                max: [5, req.t("maxRatingValidation")],
            },
            count: {
                type: Number,
                default: 0,
                min: [0, req.t("minRatingCountValidation")],
            }
        },

        views: {
            type: Number,
            default: 0,
            min: [0, req.t("minViewsValidation")],
        }
    },

    {
        timestamps: true,
    })

productSchema.plugin(addCommonVirtuals)

export const ProductModel = mongoose.model("Product", productSchema)
