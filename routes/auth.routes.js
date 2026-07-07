import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/register", async (req, res) => {

    try {
        const user = new User(req.body);
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
