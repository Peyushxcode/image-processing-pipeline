# Distributed Image Processing Pipeline

A scalable backend system that processes images asynchronously using a Producer-Consumer architecture.

## Tech Stack

* Node.js
* BullMQ
* Redis
* MongoDB
* Sharp
* Docker

## Architecture

Client → API → Redis Queue → Worker → Image Processing → MongoDB

## Features

* Asynchronous image processing using queue-based architecture
* File upload handling using Multer
* Multiple image variants generation (thumbnail, medium, large)
* Concurrent processing using Promise.all
* Job status tracking (pending → processing → completed/failed)
* Decoupled API and worker services
* Failure handling and retry mechanism

## Workflow

1. Client uploads image via API
2. Image stored locally
3. Job added to Redis queue
4. Worker processes image asynchronously
5. Multiple image sizes generated
6. Database updated with processed image paths
