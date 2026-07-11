import express from "express";
import User from "../models/user.model.js";
import {
    handleValidationErrors,
    loginValidation,
    registerValidation,
} from "../validators/auth.validator.js";
import {generateToken} from "../helpers/jwt.js";
import {handleRouteError} from "../helpers/error-handling.js";

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

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: req.t("userRegisteredSuccessfully"),
            data: user.toJSON(),
            token: token,
        })
    } catch (err) {
        handleRouteError(err, res)
    }
})

router.post("/login", loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});
        const isPasswordCorrect = await userData.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: req.t("invalidEmailOrPassword")
            })
        }

        const token = generateToken(userData);

        res.status(200).json({
            success: true,
            message: req.t("loginSuccessful"),
            data: {
                user: userData.toJSON(),
                token: token,
            },
        })

    } catch (err) {
        handleRouteError(err, res)
    }
})

export default router;
