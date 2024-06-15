const products = require('../models/productModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString}
        const excludedFields = ['page','sort','limit']
        excludedFields.forEach(ele=>delete(queryObj[ele]))

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match=>'$' + match)
        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('createdAt')
        }
        return this;
    }
    paginating(){}
}

const productController = {

    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(products.find(),req.query).filtering().sorting()
            const product = await features.query
            return res.json(product)

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createProducts: async (req, res) => {
        try {
            const { product_id, productName, price, description, images, category, checked } = req.body;

            if (!images) return res.status(400).json({ msg: "No image uploaded" })

            const product = await products.findOne({ product_id })
            if (product) return res.status(400).json({ msg: "This product already exists" })

            const newProduct = new products({ product_id, productName, images, category, description, price, checked })
            newProduct.save();
            return res.json({ msg: "Product added" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },
    updateProducts: async (req, res) => {
        try {
            const { productName, images, category, description, price, checked } = req.body
            if (!images) return res.status(400).json({ msg: "No image uploaded" })
            await products.findByIdAndUpdate({ _id: req.params.id }, { productName, images, category, description, price, checked })
            return res.json({ msg: "Product update success" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },
    deleteProducts: async (req, res) => {
        try {
            await products.findByIdAndDelete(req.params.id)
            res.json({ msg: "Product Deleted" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },

}

module.exports = productController



