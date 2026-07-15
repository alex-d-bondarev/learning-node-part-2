import express from "express";
import {ProductModel} from "../models/product.model.js";
import {handleRouteError} from "../helpers/error-handling.js";
import {getFileUrl, uploadMultiple} from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", uploadMultiple, async (req, res) => {
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

export default router;
