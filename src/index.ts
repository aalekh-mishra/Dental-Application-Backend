import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from 'helmet';

import { errorMiddleware } from './middlewares/error';
import rateLimit from './middlewares/rateLimit';

// Importing Routes
import userRoute from "./routes/user";
import adminRoute from "./routes/admin";
import config from './config/config';


const app: Application = express();

//Middleware
app.use(helmet());


// Enable CORS
// app.use(cors());
// You can also configure CORS with options if needed

const corsOptions = {
  origin: [config.CLIENT_URL as string, 'http://localhost:3000', 'http://yourdomain.com'], // Replace with your frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'browsername', 'osname', 'appversion',],
  credentials: true, // Enable cookies and other credentials
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // This middleware parses `application/x-www-form-urlencoded`


app.use(cookieParser()); // for accessing req.cookie in the auth middleware

app.get('/', rateLimit, (req, res) => {
    res.send('API is running...');
});

// Using Routes
app.use("/api/v1/user", userRoute);

// Using Admin Routes
app.use("/api/v1/user", adminRoute);

app.use(errorMiddleware);


export default app
