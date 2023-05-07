
const multer = require('multer')
const route = require('express').Router()
const { home, signin, signup, profile, editprofile, history, admin, err } = require('../services/service')
const { Predict, Signup, Signin, Profile, Updateprofile, Logout } = require('../controller/control')

const ctstorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,"ct-scan"+"_"+Date.now()+"_"+file.originalname);
    }
})
const pstorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./profile')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})
const ctupload = multer({storage:ctstorage}).single('ctscan')
const pupload = multer({storage:pstorage}).single('profile')

route.get('/',home)
route.get('/home',home)

route.get('/signin',signin)
route.post('/signin',Signin)

route.get('/signup',signup)
route.post('/signup',Signup)

route.get('/profile',profile)
route.post('/profile',pupload,Profile)

route.get('/editprofile',editprofile)
route.post('/updateprofile/:id',pupload,Updateprofile)

route.post('/predict',ctupload,Predict)

route.get('/history',history)

route.get('/admin',admin)

route.get('/logout',Logout)
route.get('*',err)

module.exports = route