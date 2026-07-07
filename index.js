import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import i18next from "i18next"
import backend from "i18next-fs-backend"
import middleware from "i18next-http-middleware";
import cors from "cors";
import morgan from "morgan";

import categoryRouter from "./routes/category.route.js"
import authRouter from "./routes/auth.routes.js"

dotenv.config();

i18next
    .use(backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: "en",
        backend: {
            loadPath: "locales/{{lng}}.json",
        }
    })

const app = express()
const port = process.env.PORT;
const api = process.env.API;

app.use(middleware.handle(i18next))
app.use(express.json())
app.use(morgan("combined"));
app.use(cors({
    origin: ["http://localhost:3000", "http://0.0.0.0:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
}))

app.use(`${api}/categories`, categoryRouter)
app.use(`${api}/auth`, authRouter)

app.get(`${api}/health`, (req, res) => {
    res.send(req.t("validationFailed"))
})

mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`Listening on http://127.0.0.1:${port}`)
})
