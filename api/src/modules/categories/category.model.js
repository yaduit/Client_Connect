import mongoose from 'mongoose';

const subCategorySchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        lowercase: true
    },
});

const categorySchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    subCategories:[subCategorySchema],

},{timestamps: true})
  export default mongoose.model('category', categorySchema);