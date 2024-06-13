const router = require('express').Router()
const categoryController = require('../controllers/categoryController')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.route('/category')
.get(categoryController.getCategories)
.post(auth,authAdmin,categoryController.createCategory)

router.route('/delete/:id')
.delete(auth,authAdmin,categoryController.deleteCategory)

router.route('/update/:id')
.put(auth,authAdmin,categoryController.updateCategory)

module.exports =router