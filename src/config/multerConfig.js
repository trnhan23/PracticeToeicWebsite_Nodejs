import multer from 'multer';
import path from 'path';
import fs from 'fs';

const allowedTypes = [
  'image/jpeg',    // JPEG Image
  'image/png',     // PNG Image
  'image/jpg',     // JPG Image
  'image/gif',     // GIF Image
  'image/bmp',     // BMP Image
  'image/tiff',    // TIFF Image
  'image/webp',    // WebP Image
  'image/svg+xml', // SVG Image
  'audio/mp3',     // MP3 Audio
  'audio/mpeg',    // MPEG Audio
  'audio/wav',     // WAV Audio
  'audio/ogg',     // OGG Audio
  'audio/flac',    // FLAC Audio
  'audio/aac',     // AAC Audio
  'audio/midi',    // MIDI Audio
];


const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File không hợp lệ'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
