const multer = require("multer");
const { CustomApiError } = require('./errors');
const { StatusCodes } = require("http-status-codes");

const errorHandler = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        switch (error.code) {
            case "LIMIT_FILE_SIZE":
                return res.status(400).json({
                    success: false,
                    message: "File is too large",
                });
            case "LIMIT_FILE_COUNT":
                return res.status(400).json({
                    success: false,
                    message: "File limit reached",
                });
            case "LIMIT_UNEXPECTED_FILE":
                return res.status(400).json({
                    success: false,
                    message: "Uploaded file Must be pdf, mp3 or mp4 file",
                });
            case "ONLY_PDF_FILE":
                return res.status(400).json({
                    success: false,
                    message: "Uploading file Must be pdf file !",
                });
            case "ONLY_MP3_FILE":
                return res.status(400).json({
                    success: false,
                    message: "Uploading file Must be mp3 file !",
                });
            case "ONLY_MP4_FILE":
                return res.status(400).json({
                    success: false,
                    message: "Uploading file Must be mp4 file !",
                });
            case "ONLY_IMAGE_FILE":
                return res.status(400).json({
                    success: false,
                    message: "Uploading file Must be an image file !",
                });
        }
    } else if (error instanceof CustomApiError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
};


module.exports = { errorHandler };