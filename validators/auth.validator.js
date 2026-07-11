import {body, validationResult} from "express-validator";

export const registerValidation = [
    body("email")
        .isEmail().withMessage((value, {req}) => req.t("enterValidEmail")),

    body("password")
        .isLength({min: 6}).withMessage((value, {req}) => req.t("passwordMinLength")),

    body("role")
        .optional()
        .isIn(["admin", "user"]).withMessage((value, {req}) => req.t("enterValidRole")),

    body("userName")
        .notEmpty().withMessage((value, {req}) => req.t("enterValidUsername")),

    body("city")
        .notEmpty().withMessage((value, {req}) => req.t("enterValidCity")),

    body("postalCode")
        .notEmpty().withMessage((value, {req}) => req.t("enterValidPostalCode")),

    body("addressLine1")
        .notEmpty().withMessage((value, {req}) => req.t("enterValidAddressLine1")),

    body("addressLine2")
        .optional(),

    body("phoneNumber")
        .notEmpty().withMessage((value, {req}) => req.t("enterNonEmptyPhoneNumber"))
        .matches(/^\+?[0-9]{10,15}$/).withMessage((value, {req}) => req.t("enterValidPhoneNumber")),
]

export const loginValidation = [
    body("email")
        .isEmail().withMessage((value, {req}) => req.t("enterValidEmail")),
]

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    next()
}
