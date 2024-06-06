const users = require('../models/userModel')
const bcrypt = require('bcrypt')

const userController ={
    register :async (req, res)=>{
       try {
        const{name,email,password} = req.body
        const user = await users.findOne({email})
        if(user) return res.status(400).json({msg :"this email already exists" })

        if(password.length < 6)
        return res.status(400).json({msg :"password must be at least 6 characters" }) 

        const passwordHash = await bcrypt.hash(password,10)

        const newUser = new users({
            name,email,password:passwordHash
        })  
        await newUser.save();
        return res.json({msg : "Register Successfull"})

       } catch (error) {
        return res.status(500).json({msg : error.message}) 
       }    
    }
}

module.exports = userController