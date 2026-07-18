import express from "express";
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
            }

        } catch (error) {
            handleRouteError(error, res)
        }
    })

export default router;
