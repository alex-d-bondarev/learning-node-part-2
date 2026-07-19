import express from "express";
import mongoose from "mongoose";
import {OrderModel} from "../models/order.model.js";
import {handleRouteError} from "../helpers/error-handling.js";
import {userAndAdmin} from "../middleware/roles.middleware.js";

const router = express.Router();

router.post(
    "/",
    userAndAdmin,
    async (req, res) => {
        try {

            const {orderItems} = req.body;
            const {auth: currentUser} = req;

            if (!orderItems || !Array.isArray(orderItems) || orderItems.length < 1) {
                return res.status(403).json({
                    message: req.t("orderItemsRequired"),
                });
            }

            for (const item of orderItems) {
                if (!item.product || !item.quantity) {
                    return res.status(403).json({
                        message: req.t("orderItemDetailsMissing"),
                    })
                }

                if (!mongoose.Types.ObjectId.isValid(item.product)) {
                    return res.status(400).json({
                        message: req.t("invalidProductId"),
                        ivalidId: item.product
                    })
                }

                if (typeof item.quantity !== "number" || item.quantity < 1) {
                    return res.status(400).json({
                        message: req.t("minQuantity1Validation"),
                        invalidQuantity: item.quantity,
                    })
                }

                if (!Number.isInteger(item.quantity)) {
                    return res.status(400).json({
                        message: req.t("quantityIsWholeNumberValidation"),
                        invalidQuantity: item.quantity,
                    })
                }
            }

        } catch (error) {
            handleRouteError(error, res)
        }
    })

export default router;
