import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const publicRoutes = [
    "POST:/api/v1/auth/login",
    "POST:/api/v1/auth/register",
]

export const authMiddleware = (req, res, next) => {
    try {
        const method = req.method;
        const path = req.path;
        const route = `${method}:${path}`;

        if (publicRoutes.some(publicRoute => publicRoute.includes(route))) {
            return next();
        }

        const token = req.headers.authorization?.split(" ")[1]

        if(!token) return res.status(401).json({
            success: false,
            message: req.t("missingToken"),
        })

        const decodedToken = jwt.verify(token, process.env.SECRET)

        req.auth = {
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
            userName: decodedToken.userName,
            phoneNumber: decodedToken.phoneNumber,
        }

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: req.t("invalidToken"),
        })
    }
}
