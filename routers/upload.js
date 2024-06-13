const router = require('express').Router();
const cloudinary = require('cloudinary')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
})

router.post('/upload', (req, res) => {
    try {
        console.log(req.files);
        if (!req.files || (!req.files.file && !req.files.undefined)) {
            return res.status(400).json({ msg: "No files were uploaded" });
        }

        const file = req.files.file ? req.files.file : req.files.undefined;

        if (file.size >10* 1024 * 1024) {
            removeTemp(file.tempFilePath)
            return res.status(400).json({ msg: "File is too large" });
        }

        if(file.mimetype !=='image/jpeg' && file.mimetype !== 'image/png') {
            removeTemp(file.tempFilePath)
            return res.status(400).json({ msg: "File format is incorrect" });
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder:'test'},async(err,result)=>{
            if(err) throw err;
            removeTemp(file.tempFilePath)
            return res.json({public_id:result.public_id, url:result.secure_url});
        })

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
})

const removeTemp=(path)=>{
    fs.unlink(path, err=>{
        if(err) throw err
    })
}

module.exports = router;
