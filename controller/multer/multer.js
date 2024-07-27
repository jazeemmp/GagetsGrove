const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,path.join(__dirname,'..','..', '/public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null,Date.now() + '-' + file.originalname); // Unique filename based on timestamp
  }
});

// Initialize multer
const upload = multer({ storage });

module.exports = upload;
