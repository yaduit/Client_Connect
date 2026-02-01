import categoryModel from "./category.model.js";

export const createCategory = async (req,res)=>{
    //Adimin create category//
    try{
        let{name} = req.body;
        if(!name){
            return res.status(400).json({message: 'Category name is required'})
        }
        name = name.trim();
        const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');


        const exist = await categoryModel.findOne({slug});
        if(exist){
            return res.status(409).json({message: 'Category already exists'})
        }
        const category = await categoryModel.create({name, slug})
        return res.status(201).json({message: 'Category created',category});
    }catch(error){
        console.log(error) //remove during production//
        res.status(500).json({message: 'Internal server error'})
    }

};

//Public: get all categories//

export const getCategories = async(req,res)=>{
    try{
        const categories = await categoryModel.find().select('name slug subCategories')
        return res.status(200).json(categories);
    }catch(error){
        return res.status(500).json({message: 'internal server error'})
    }
};

/**
 * PUBLIC: Get single category by slug with subcategories
 * Route: GET /api/categories/:slug
 * Used for: Category detail page
 */
export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({ message: 'Category slug is required' });
        }

        const category = await categoryModel.findOne({ slug }).select('_id name slug subCategories');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//Admin add subcategory to a category//

export const addSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }

    name = name.trim();

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const exists = category.subCategories.find(
      (sub) => sub.slug === slug
    );

    if (exists) {
      return res.status(409).json({ message: 'Subcategory already exists' });
    }

    category.subCategories.push({ name, slug });
    await category.save();

    return res.status(201).json({
      message: 'Subcategory added successfully',
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};