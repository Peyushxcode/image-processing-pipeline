const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const sharp = require("sharp");
const path = require("path");
const connectDB = require("../db/mongo");
const Image = require("../db/imageModel");

connectDB();

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const worker = new Worker(
    "image-processing",
    async (job) => {
        const { filePath, mongoId } = job.data;

        await Image.findByIdAndUpdate(mongoId, {
            status: "processing"
        });
        console.log("Processing image:", filePath);

        // create output path
        const fileName = path.basename(filePath);
        const thumbPath = path.join(__dirname, "../processed", "thumb-" + fileName);
        const mediumPath = path.join(__dirname, "../processed", "medium-" + fileName);
        const largePath = path.join(__dirname, "../processed", "large-" + fileName);

        console.log("Generating multiple sizes...");

        // process image
        await Promise.all([
            sharp(filePath).resize(100, 100).toFile(thumbPath),
            sharp(filePath).resize(500, 500).toFile(mediumPath),
            sharp(filePath).resize(1000, 1000).toFile(largePath)
        ]);

        console.log("All sizes generated");

        console.log("Processed image saved");
        await Image.findByIdAndUpdate(mongoId, {
            status: "completed",
            processedPaths: {
                thumbnail: thumbPath,
                medium: mediumPath,
                large: largePath
            }
        });
        return { outputPath };
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed: ${err.message}`);
});