const multer = require('multer');

// storing data in memory temporarily to upload to aws
const storage = multer.memoryStorage();



const pdfFileFilter = (req, file, cb) => {
  let fileType = file.mimetype.split('/')[1];
  if(fileType === 'pdf') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('ONLY_PDF_FILE'), false);
  }
};

const mp3FileFilter = (req, file, cb) => {
  let fileType = file.mimetype.split('/')[1];
  if(fileType === 'mpeg') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('ONLY_MP3_FILE'), false);
  }
};

const mp4FileFilter = (req, file, cb) => {
  let fileType = file.mimetype.split('/')[1];
  if(fileType === 'mp4') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('ONLY_MP4_FILE'), false);
  }
};

const addImageFilter = (req, file, cb) => {
  let fileType = file.mimetype.split('/')[0];
  if(fileType === 'image') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('ONLY_IMAGE_FILE'), false);
  }
}

const uploadPdf = multer({
    storage,
    fileFilter: pdfFileFilter,
    limits: { fileSize: 100 * 1024 * 1024, files: 1 },
});

const uploadMp3 = multer({
  storage,
  fileFilter: mp3FileFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 1 },
});

const uploadMp4 = multer({
  storage,
  fileFilter: mp4FileFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 1 },
});

const uploadAddImage = multer({
  storage,
  fileFilter: addImageFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 1 }
})


module.exports = { uploadPdf, uploadMp3, uploadMp4, uploadAddImage };
  