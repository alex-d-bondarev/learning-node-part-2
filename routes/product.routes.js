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
        const productsList = await ProductModel.find()
        if (!productsList || productsList.length === 0) {
            res.send({message: req.t("noProductsFound")})
        }
        res.send(productsList)
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

export default router;
