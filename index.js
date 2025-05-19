import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import cors from 'cors';
import connectDB from './config/db.js';
import userRoute from './routes/userRoutes.js';
import companyRoute from './routes/companyRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import EmployeeRoute from './routes/employeeRoute.js';



const app = express()
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow frontend to access backend
    credentials: true, // Allow cookies & authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoute);
app.use('/api/company', companyRoute);
app.use('/api/employee', EmployeeRoute);


app.get('/', (req, res) => {
    res.send('API is running....');
});


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
//YC6QcMfun1PUKgTg