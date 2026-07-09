import express from "express";
import User from "../models/user.model.js";
import {registerValidation, handleValidationErrors} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidation, handleValidationErrors, async (req, res) => {

    try {
        const user = new User(req.body);

        const {email} = req.body;

        const existingEmailByEmail = await User.findOne({email})
        if (existingEmailByEmail) {
            return res.status(400).json({
                success: false,
                message: req.t("emailAlreadyExists")
            });
        }

        await user.save()

        res.status(201).json({
            success: true,
            message: req.t("userRegisteredSuccessfully"),
            data: user.toJSON()
        })
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})

export default router;
