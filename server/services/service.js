const Profile = require('../models/profile')
const History = require('../models/history')

exports.home = async( req,res ) => {
    const auth = req.session.auth
    let isProfile
    if(auth)
    {
        isProfile = await Profile.findOne({_id:auth._id})
    }
    res.render('index',{title:"Home",auth:auth,profile:isProfile})
}

exports.signin = async( req,res ) => {
    const auth = req.session.auth
    if(auth)
    {
       res.redirect('/') 
    }
    res.render('signin',{title:"Sign In",auth:auth})
}

exports.signup = async( req,res ) => {
    const auth = req.session.auth
    if(auth)
    {
       res.redirect('/') 
    }
    res.render('signup',{title:"Sign Up",auth:auth})
}

exports.profile = async( req,res ) => {
    const auth = req.session.auth
    let isProfile
    if(auth)
    {
        isProfile = await Profile.findOne({_id:auth._id})
    }
    res.render('profile',{title:"Sign Up",auth:auth,profile:isProfile})
}

exports.editprofile = async( req,res ) => {
    const auth = req.session.auth
    let isProfile
    if(auth)
    {
        isProfile = await Profile.findOne({_id:auth._id})
    }
    res.render('editprofile',{title:"Edit Profile",auth:auth,profile:isProfile})
}

exports.history = async( req,res ) => {
    if(!req.session.auth)
    {
        res.redirect('/')
    }
    else
    {
        const auth = req.session.auth
    let isProfile
    if(auth)
    {
        isProfile = await Profile.findOne({_id:auth._id})
    }
        if(req.query.username)
        {
            const auth = req.session.auth
            const qusername = req.query.username
            const hist = await History.find({username:qusername})
            const hcount = await History.find({username:qusername}).count()
            res.render('history',{
            title:'History',
            auth:auth,
            hcount:hcount,
            hist:hist,
            profile:isProfile
            })
        }
        else
        {
            const auth = req.session.auth
            const hist = await History.find({email:auth.email})
            const hcount = await History.find({email:auth.email}).count()
            res.render('history',{
                title:'History',
                auth:auth,
                hcount:hcount,
                hist:hist,
                profile:isProfile
                })
        }
    }
    
}

exports.admin = async( req,res )=>{
    const auth = req.session.auth
    let isProfile
    if(auth)
    {
        if(auth.role == 'admin')
    {
        isProfile = await Profile.findOne({_id:auth._id})
        allProfile = await Profile.find({})
        tuser = await Profile.find({role:'user'}).count()
        thist = await History.find({role:'user'}).count()
        res.render('admin',{title:"Admin",auth:auth,profile:isProfile,tusers:tuser,thist:thist,users:allProfile})
    }
    else
    {
        res.redirect('/')
    }
    }
    else
    {
        res.redirect('/')
    }
    
}

exports.err = async( req,res ) => {
    res.redirect('/')
}