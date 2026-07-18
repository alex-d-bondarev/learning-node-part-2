import {body, validationResult} from "express-validator";

export const createProductValidation = [
    body("title")
        .trim()
        .notEmpty().withMessage((value, {req}) => req.t("productTitleRequired"))
        .isLength({min: 2}).withMessage((value, {req}) => req.t("productTitleMinLength"))
        .isLength({max: 100}).withMessage((value, {req}) => req.t("productTitleMaxLength")),

    body("category")
        .notEmpty().withMessage((value, {req}) => req.t("categoryNameValidation"))
        .isMongoId().withMessage((value, {req}) => req.t("categoryIdValidation")),

    body("price")
        .notEmpty().withMessage((value, {req}) => req.t("priceIsRequired"))
        .isFloat().withMessage((value, {req}) => req.t("priceNumberValidation"))
        .isFloat({min: 0}).withMessage((value, {req}) => req.t("minPriceValidation")),

    body("description")
        .trim()
        .notEmpty().withMessage((value, {req}) => req.t("mandatoryDescriptionValidation"))
        .isLength({min: 5}).withMessage((value, {req}) => req.t("descriptionNameMinLength"))
        .isLength({max: 255}).withMessage((value, {req}) => req.t("descriptionNameMaxLength")),


    body("images")
        .optional(),
        // .notEmpty().withMessage((value, {req}) => req.t("mandatoryImagesValidation"))
        // .isArray().withMessage((value, {req}) => req.t("imagesArrayValidation")),

    body("countInStock")
        .optional()
        .isInt().withMessage((value, {req}) => req.t("countInStockNumberValidation"))
        .isInt({min: 0}).withMessage((value, {req}) => req.t("minCountInStockValidation"))
        .isInt({max: 99999}).withMessage((value, {req}) => req.t("maxCountInStockValidation")),

    body("rating.average")
        .optional()
        .isFloat({min: 0}).withMessage((value, {req}) => req.t("minRatingValidation"))
        .isFloat({max: 5}).withMessage((value, {req}) => req.t("maxRatingValidation")),

    body("rating.count")
        .optional()
        .isInt({min: 0}).withMessage((value, {req}) => req.t("minRatingCountValidation")),

    body("views")
        .optional()
        .isInt({min: 0}).withMessage((value, {req}) => req.t("minViewsValidation")),
]
