import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: false
    },
    desc:{
        type: String,
        required: false
    },
    phone:{
        type: String,
        required: false
    },
    country:{
        type: String,
        required: true
    },
    isSeller:{
        type: Boolean,
        default: false
    }

},
{timestamps : true}
)

export default mongoose.model('user', userSchema)