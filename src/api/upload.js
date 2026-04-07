const express = require("express");
const multer = require("multer");
const path = require("path");
const imageQueue = require("../queue/queue");
const connectDB = require("../db/mongo");
const Image = require("../db/imageModel");
const { mongo } = require("mongoose");

connectDB();

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images allowed"), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/", upload.single("image"), async (req, res) => {

    const filePath = req.file.path;
    const newImage = await Image.create({
        originalPath: filePath,
        status: "pending"
    });

    const job = await imageQueue.add("process-image", {
        filePath,
        mongoId: newImage._id
    });

    res.json({
        message: "File uploaded successfully",
        jobId: job.id,
        filePath: req.file.path,
        mongoId:newImage._id
    });
});

module.exports = router;