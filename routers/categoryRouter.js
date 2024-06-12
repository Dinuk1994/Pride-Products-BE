const router = require('express').Router()
const categoryController = require('../controllers/categoryController')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.route('/category')
.get(categoryController.getCategories)
.post(auth,authAdmin,categoryController.createCategory)


module.exports =router