import mongoose from 'mongoose'

const connectDB = async function(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to db")
    }catch(error){
        console.log('db connection failed',error.message);
        process.exit(1);
    }
}
export default connectDB