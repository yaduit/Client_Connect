import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash:{
        type: String,
        required: true,
        select: false
    },
    role:{
        type: String,
        enum:['seeker','provider','admin'],
        default: 'seeker'
    },
    phoneNum:{
        type: String
    },
    location:{
        city: String,
        state: String,
        coordinates:{
            type: [Number],
            index: '2dsphere'
        },
        geo:{
            type:{
                type: String,
                enum: ['point'],
                default: 'point'
            }
        }
    },
    isVerified:{
        type: Boolean,
        default: false
    }

},{timestamps: true});

export default mongoose.model('user',userSchema);