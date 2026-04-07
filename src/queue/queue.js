const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  maxRetriesPerRequest: null
});

const imageQueue = new Queue("image-processing", {
  connection
});

module.exports = imageQueue;