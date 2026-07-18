import express from "express";
import {ProductModel} from "../models/product.model.js";
import {handleRouteError} from "../helpers/error-handling.js";
import {getFileUrl, handleUploadError, uploadMultiple} from "../middleware/upload.middleware.js";
import {adminOnly, userAndAdmin} from "../middleware/roles.middleware.js";
import {createProductValidation, updateProductValidation} from "../validators/product.validator.js";
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

router.get("/", userAndAdmin, async (req, res) => {
    try {

        const search = req.query.search
        const categoryID = req.query.CategoryID

        const filter = {}

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        if (search) {
            filter.$or = [
                {title: {$regex: search, $options: "i"}},
                {description: {$regex: search, $options: "i"}}
            ]
        }

        if (categoryID) {
            filter.category = categoryID
        }

        const totalCount = await ProductModel.countDocuments(filter)
        const totalPages = Math.ceil(totalCount / limit)

        const productsList = await ProductModel
            .find(filter)
            .populate("category")
            .skip(skip)
            .limit(limit)

        const sharedDataResponse = {
            search,
            categoryID,
            page,
            limit,
            totalProducts: totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }

        if (!productsList || productsList.length === 0) {
            return res.json({
                message: req.t("noProductsFound"),
                data: [],
                ...sharedDataResponse,
            })
        }

        return res.json({
            data: productsList,
            ...sharedDataResponse,
        })
    } catch (err) {
        handleRouteError(err, res)
    }
})

router.get("/:id", userAndAdmin, async (req, res) => {
    try {

        const product = await ProductModel.findByIdAndUpdate(
            req.params.id,
            {$inc: {views: 1}},
            {new: true}
        ).populate("category")

        if (!product) {
            return res.status(401).json({
                message: req.t("noProductsFound")
            })
        }

        return res.status(200).json(product)

    } catch (error) {
        handleRouteError(err, res)
    }
})

router.delete("/:id", adminOnly, async (req, res) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id)
        if (!deletedProduct) {
            return res.status(404).send({message: req.t("noProductsFound")})
        }

        return res.status(200).send({message: req.t("productDeletedSuccessfully")})
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

router.put(
    "/:id",
    adminOnly,
    uploadMultiple,
    handleUploadError,
    updateProductValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const existingProduct = await ProductModel.findById(req.params.id);
            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: req.t("noProductsFound"),
                });
            }

            const updateData = {};

            if (req.body.title !== undefined) updateData.title = req.body.title;
            if (req.body.price !== undefined)
                updateData.price = parseFloat(req.body.price);
            if (req.body.category !== undefined)
                updateData.category = req.body.category;
            if (req.body.countInStock !== undefined)
                updateData.countInStock = parseInt(req.body.countInStock);
            if (req.body.description !== undefined)
                updateData.description = req.body.description;

            if (req.files && req.files.length > 0) {
                const imageURLs = req.files.map((file) =>
                    getFileURL(req, file.filename)
                );

                if (req.body.replaceImages === "true") {
                    updateData.images = imageURLs;
                } else {
                    updateData.images = [...existingProduct.images, ...imageURLs];
                }
            }

            const updatedProduct = await ProductModel.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            ).populate("category");

            return res.status(200).json({
                success: true,
                message: req.t("productUpdatedSuccessfully"),
                data: updatedProduct,
            });
        } catch (error) {
            handleRouteError(error, res);
        }
    }
);

export default router;
