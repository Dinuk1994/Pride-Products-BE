const categoryName = require('../models/categoryModel')

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const category = await categoryName.find()
            return res.json(category)

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const category = await categoryName.findOne({ name })
            if (category) return res.status(400).json({ msg: "This category already exists" })

            const newCategory = new categoryName({ name })

            await newCategory.save()
            return res.json({msg : "Created category success"})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    deleteCategory : async(req,res)=>{
        try {
            await categoryName.findByIdAndDelete(req.params.id)
            return res.json({msg : "category deleted"})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = categoryController