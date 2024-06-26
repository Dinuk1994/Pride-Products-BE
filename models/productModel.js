const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
        trim: true,
    },
    content :{
        type : String,
        requires : true,
    },
    description :{
       type : String,
       requires : true,
    },
    category : {
        type : String,
        requires : true,
    },
    checked : {
        type : Boolean,
        default : false
    },
    sold : {
        type : Number,
        default : 0
    },
    price : {
        type: Number,
        required: true,
    },
    images : {
        type : Object,
        reqired : true
    }
    
},{
    timestamps : true
})

module.exports = mongoose.model("Products", productSchema)