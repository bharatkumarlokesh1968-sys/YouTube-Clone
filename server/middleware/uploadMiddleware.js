const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.mimetype.startsWith('video/') ? './uploads/videos' : './uploads/thumbnails';
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    file.mimetype.startsWith('video/') ? cb(null, true) : cb(new Error('Only video files allowed'), false);
  } else if (file.fieldname === 'thumbnail' || file.fieldname === 'avatar') {
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image files allowed'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024 },
});

module.exports = upload;
