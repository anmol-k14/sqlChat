import express from 'express';
import mysql from 'mysql2/promise';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import cors from 'cors';

dotenv.config();


export const db =await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'mentalhealth'
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());


app.use('/ai',aiRoutes)

const port=process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


