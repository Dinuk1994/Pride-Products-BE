const products = require('../models/productModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){  //http://localhost:5000/api/products?price=1500   //  http://localhost:5000/api/products?price[gte]=4500(more than products price 4500)  //http://localhost:5000/api/products?price[lte]=4500(less than products price 4500)
        const queryObj = {...this.queryString}
        const excludedFields = ['page','sort','limit']
        excludedFields.forEach(ele=>delete(queryObj[ele]))

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match=>'$' + match)
        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }
    sorting(){ //http://localhost:5000/api/products?sort=price
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('createdAt')
        }
        return this;
    }
    paginating(){//http://localhost:5000/api/products?limit=2
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 4 //selecting how many items that needs to display on a page
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productController = {

    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(products.find(),req.query).filtering().sorting().paginating()
            const product = await features.query
            return res.json({
                status : "success",
                result : product.length,
                product
            })

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

            const newProduct = new products({ product_id, productName, images,content, category, description, price, checked })
            newProduct.save();
            return res.json({ msg: "Product added" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },
    updateProducts: async (req, res) => {
        try {
            const { productName, images,content, category, description, price, checked } = req.body
            if (!images) return res.status(400).json({ msg: "No image uploaded" })
            await products.findByIdAndUpdate({ _id: req.params.id }, { productName, images,content, category, description, price, checked })
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



