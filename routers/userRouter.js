const router = require('express').Router();
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth')


router.post('/register',userController.register )
router.post('/login',userController.login)
router.get('/refresh_token',userController.refreshToken )
router.get('/logout',userController.logoout)
router.get('/infor',auth,userController.getUser)

module.exports = router
