import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subCategorySlug:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    businessName:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true,
    },
    location:{
        city: String,
        state: String,
        geo:{
            type:{
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates:{
                type: [Number],
                required: true,
                validate:{
                    validator: v => v.length === 2,
                    message: 'Cordinates must be [lng,lat]'
                }
            }
        }
    },
    isActive:{
        type: Boolean,
        default: true
    },
    ratingAverage:{
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews:{
        type: Number,
        default: 0
    }
    
},{timestamps: true});

serviceProviderSchema.index({ 'location.geo': '2dsphere' });

serviceProviderSchema.index({
  categoryId: 1,
  subCategorySlug: 1,
});

export default mongoose.model('serviceProvider',serviceProviderSchema);