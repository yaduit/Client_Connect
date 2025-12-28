import express from 'express'
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const port = process.env.PORT||3000;
mongoose.set("strictQuery", true);

const connect = async function(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to db")
    }catch(err){
        console.log(err.message)
    }
}
connect()


app.get("/", function(req,res){
    res.send("Hello from Express server!");
});

app.listen(port, function(){
    console.log("Server is running on port 3000");
})
