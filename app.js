const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const { Client } = require('pg');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Set up Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Database connection error:', err));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Real-time socket connection
io.on('connection', (socket) => {
  console.log('New user connected');

  // Listen for incoming messages
  socket.on('sendMessage', (message, userId) => {
    socket.broadcast.emit('newMessage', { message, userId });
  });

  // Listen for file uploads
  socket.on('sendFile', (file) => {
    cloudinary.uploader.upload(file, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        io.emit('newFile', result.secure_url);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      return res.status(500).send('Error uploading file');
    }
    res.json({ url: result.secure_url });
  });
});

// Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  
