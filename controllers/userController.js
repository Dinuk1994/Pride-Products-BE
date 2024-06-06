const users = require('../models/userModel')

const userController ={
    register :(req, res)=>{
        res.json({msg : "test controller"})
    }
}

module.exports = userController