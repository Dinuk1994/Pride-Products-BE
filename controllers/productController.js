const products = require('../models/productModel')

const productController = {

    getProducts: async (req, res) => {
        try {
           

        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createProducts: async (req, res) => {
        try {
            const { product_id,productName, price, description, images, category,checked } = req.body;

            if (!images) return res.status(400).json({ msg: "No image uploaded" })

            const product = await products.findOne({ product_id })
            if (product) return res.status(400).json({ msg: "This product already exists" })

            const newProduct = new products({ product_id, productName, images, category, description, price ,checked })
            newProduct.save();
            return res.json({ msg : "Product saved successsfully" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },
    updateProducts: async (req, res) => {
        try {
            

        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },
    deleteProducts: async (req, res) => {
        try {
            const product = await products.findByIdAndDelete(req.params.id)
            res.json({msg : "Product Deleted"})
        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },

}

module.exports = productController



