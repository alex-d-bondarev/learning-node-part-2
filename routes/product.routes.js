import express from "express";
import {ProductModel} from "../models/product.model.js";
import {handleRouteError} from "../helpers/error-handling.js";
import {getFileUrl, handleUploadError, uploadMultiple} from "../middleware/upload.middleware.js";
import {adminOnly} from "../middleware/roles.middleware.js";
import {createProductValidation} from "../validators/product.validator.js";
import {handleValidationErrors} from "../validators/auth.validator.js";

const router = express.Router();

router.post(
    "/",
    adminOnly,
    uploadMultiple,
    handleUploadError,
    createProductValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            let imageUrls = [];

            if (req.files && req.files.length > 0) {
                imageUrls = req.files.map((file) => getFileUrl(req, file.filename))
            }

            let newProduct = new ProductModel({
                title: req.body.title,
                price: parseFloat(req.body.price),
                category: req.body.category,
                countInStock: parseInt(req.body.countInStock),
                description: req.body.description,
                images: imageUrls,
            })

            newProduct = await newProduct.save()

            return res.status(201).json({
                success: true,
                message: req.t("productCreatedSuccessfully"),
                data: newProduct,
            })

        } catch (error) {
            handleRouteError(error, res)
        }
    })

router.get("/", async (req, res) => {
    try {

        const search = req.query.search
        const categoryID = req.query.CategoryID

        const filter = {}

        if (search) {
            filter.$or = [
                {title: {$regex: search, $options: "i"}},
                {description: {$regex: search, $options: "i"}}
            ]
        }

        if (categoryID) {
            filter.category = categoryID
        }

        const productsList = await ProductModel.find(filter).populate("category")
        if (!productsList || productsList.length === 0) {
            return res.json({
                message: req.t("noProductsFound"),
                data:[],
                search,
                categoryID,
            })
        }

        return res.json(productsList)
    } catch (err) {
        handleRouteError(err, res)
    }
})

export default router;
