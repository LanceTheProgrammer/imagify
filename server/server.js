import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json())

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Request body:', req.body);
    next();
  });

// Define allowed origins (your Vercel frontend URL and localhost for local development)
const allowedOrigins = ['https://imagify-frontend-nu.vercel.app', 'https://imagify-server-cyan.vercel.app/']; // Add other domains if needed

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) { // allows requests without origin (e.g., Postman)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
};

app.use(cors(corsOptions));

await connectDB();

app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
app.get('/', (req, res) => res.send("API WORKING"));

app.listen(PORT, () => console.log('Server running on port ' + PORT));
