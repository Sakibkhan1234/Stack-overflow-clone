import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import cloudinary from 'cloudinary';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import questionRoutes from './routes/Questions.js';
import answerRoutes from './routes/Answers.js';
import connectDB from './connectMongoDb.js';
import notificationRoutes from './routes/Notifications.js';
import qaRouter from './routes/qa.js';
import otpRouter from './routes/otp.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "https://sakib-stack-overflow-clone.netlify.app",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('uploads'));

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const deleteUploadedVideos = () => {
  const dir = 'uploads/';
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(dir, file), err => {
        if (err) throw err;
      });
    }
  });
};

deleteUploadedVideos();

const uploadToCloudinary = (videoPath, resolutions, retries = 3) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_large(videoPath, {
      resource_type: 'video',
      eager: resolutions.map(resolution => ({
        width: resolution,
        crop: 'scale',
        format: 'mp4'
      }))
    }, (error, result) => {
      if (error) {
        if (retries > 0) {
          console.log(`Retrying upload... Attempts left: ${retries}`);
          return resolve(uploadToCloudinary(videoPath, resolutions, retries - 1));
        }
        return reject(error);
      }
      resolve(result);
    });
  });
};

app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const videoPath = req.file.path;
  const resolutions = [144, 240, 320, 480, 720, 1080];

  try {
    const result = await uploadToCloudinary(videoPath, resolutions);
    const outputFiles = result.eager.map((version, index) => ({
      label: `${resolutions[index]}p`,
      src: version.secure_url
    }));

    fs.unlinkSync(videoPath);

    res.json({
      defaultSrc: outputFiles[0].src,
      resolutions: outputFiles
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary after retries:', error);
    res.status(500).send('Error uploading video');
  }
});

// Routes
app.use('/user', userRoutes);
app.use('/questions', questionRoutes);
app.use('/answer', answerRoutes);
app.use('/notifications', notificationRoutes);
app.use('/api', qaRouter);
app.use('/api', otpRouter);

const rooms = {};

app.post('/create_room', (req, res) => {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ success: false, message: 'Room ID is required' });
  }

  if (rooms[roomId]) {
    return res.status(400).json({ success: false, message: 'Room ID already exists' });
  }

  rooms[roomId] = [];
  res.json({ success: true, roomId });
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('join', ({ username, room }) => {
    if (!rooms[room]) {
      socket.emit('no-room', { message: 'Room ID does not exist' });
    } else {
      socket.join(room);
      rooms[room].push(username);
      io.to(room).emit('user-joined', { username });
    }
  });

  socket.on('leave', ({ username, room }) => {
    if (rooms[room]) {
      rooms[room] = rooms[room].filter(user => user !== username);
      if (rooms[room].length === 0) {
        delete rooms[room];
      }
      socket.leave(room);
      io.to(room).emit('user-left', { username });
    }
  });

  socket.on('message', ({ sender, msg, room }) => {
    io.to(room).emit('message', { sender, msg });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

