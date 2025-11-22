const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// MIME type & extension validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png'];
  if (!allowed.includes(ext)) {
    return cb(new Error('Only image files are allowed (jpg, jpeg, png)'), false);
  }
  cb(null, true);
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // store inside /uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  },
});

//  Multer instance
const MB = 1024 * 1024;
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * MB }, // 2MB max
});


module.exports =  upload;
