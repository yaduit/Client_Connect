import express from 'express'
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes.js'
import cookieParser from 'cookie-parser'
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get("/", function(req,res){
    res.send("Hello from Express server!");
});
app.use('/api/auth', authRoutes)


export default app