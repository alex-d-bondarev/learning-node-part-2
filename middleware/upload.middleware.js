import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = "public/uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.round() * 1e9)

        const extension = path.extname(file.originalname);

        cb(null, `product-${uniqueSuffix}${extension}`);
    }
})

const fileFilter = (req, file, callback) => {
    if(file.mimetype.startsWith("image/")){
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
        files: 10
    }
})

export const uploadSingle = upload.single("image");
export const uploadMultiple = upload.array("images", 10);
