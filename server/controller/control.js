const fs = require('fs')
const bcrypt = require('bcrypt')
const Auth = require('../models/auth')
const { spawn } = require('child_process')
const Profile = require('../models/profile')
const History = require('../models/history')

exports.Predict = async( req,res ) => {
    const auth = req.session.auth
    if(auth)
    {
        const filename = req.file.filename
        const {username,role,email }= req.body 
        const process = await spawn('python',['./server/python/process.py',filename])
        let result
    process.stdout.on('data',(data)=>{
        result = data.toString()
        console.log(typeof(result))
        console.log(result)
    })

    setTimeout(()=>{
        if(result == 0)
        {
            const newHistory = History({
                username:username,
                role:role,
                email:email,
                image:filename,
                result:"No Kidney Stone Detected "
            })
            newHistory.save()
            req.session.result = {
                type : 'success',
                message : 'Result !',
                result : "No Kidney Stone Detected 🌻",
            }  

        }
        else if(result == 1)
        {
            const newHistory = History({
                username:username,
                role:role,
                email:email,
                image:filename,
                result:"Kidney Stone Detected "
            })
            newHistory.save()
            req.session.result = {
                type : 'warning',
                message : 'Result !',
                result : "Kidney Stone Detected 💔",
                desc:"Please do consult Urologists !"
            }
           
        }


        res.redirect('/')
    },10000)
    
    
    }
    else
    {
        req.session.message = {
            type : 'info',
            message : 'Info !',
            desc : 'Please Sign In First !'
        }
        res.redirect('/')
    }
    

}

exports.Signin = async( req,res ) => {

    try {
        const { email , password } = req.body

    const isEmail = await Auth.findOne({email:email})
        
        if ( !isEmail)
        {
            req.session.message = {
                type : 'info',
                message : 'Info !',
                desc : 'Email does not exist ! Please signup first'
            }
            res.redirect('/signup')
        }
        else
        {
            const isMatch = await bcrypt.compareSync(password,isEmail.password)

            if( isMatch )
            {
                const isProfile = await Profile.findOne({_id:isEmail._id})
                    if(isProfile)
                    {
                        req.session.auth = {
                            _id : isEmail._id,
                            role : isEmail.role,
                            email : isEmail.email
                        } 
                        req.session.message = {
                            type : 'success',
                            message : 'Logged In !',
                            desc : 'logged in successfully !'
                        }
                        res.redirect('/')
                    }
                    else
                    {
                        req.session.auth = {
                        _id : isEmail._id,
                        role : isEmail.role,
                        email : isEmail.email
                        }
                        req.session.message = {
                            type : 'success',
                            message : 'Logged In !',
                            desc : 'logged in successfully !'
                        }
                    res.redirect('/profile')
                    }
            }
            else
            {
                req.session.message = {
                    type : 'warning',
                    message : 'warning !',
                    desc : 'Password entered was wrong'
                }
                res.redirect('/signin')
            }
        }
    } catch (error) {
        console.log(error)
    }

}

exports.Signup = async( req,res ) => {
    const { email, password, cpassword } = req.body

    const isUserExist = await Auth.findOne({email:email})

    if(isUserExist)
    {
        req.session.message = {
            type : 'info',
            message : 'Information !',
            desc : 'User Already Exist Please Signin or Use New Email !'
        }
        res.redirect('/signin')
    }
    else
    {
        if(password != cpassword)
        {
        req.session.message = {
            type : 'warning',
            message : 'WARNING !',
            desc : 'Password did not match !'
        }
        res.redirect('/signup')
        }
        else
        {
            const regEmail = /@kidney.com/i
            const isAdmin = regEmail.test(email)
            const hashpass = await bcrypt.hashSync(password,12)
            if( isAdmin )
            {
            const newUser = new Auth({
                email:email,
                password:hashpass,
                role : 'admin'
            })
            newUser.save().catch( err => {
                console.log(err)
            }).then(
                () => {
                    req.session.message = {
                        type : 'success',
                        message : 'Success !',
                        desc : 'Sign up successfull ! Now Please Sign in'
                    }
                    res.redirect('/signin')
                }
            ) 
        }
        else
        {
            const newUser = new Auth({
                email:email,
                password:hashpass
            })
            newUser.save().catch( err => {
                console.log(err)
            }).then(
                () => {
                    req.session.message = {
                        type : 'success',
                        message : 'Success !',
                        desc : 'Sign up successfull ! Now Please Sign in'
                    }
                    res.redirect('/signin')
                }
            ) 
        } 
            
        }
    }

    
    
}

exports.Profile = async( req,res ) => {
    try {
        const { _id, role, email, username, gender, profession } = req.body
        const pimg = req.file.filename

        const newProfile = new Profile({
            _id : _id,
            role : role,
            email : email,
            username : username,
            gender : gender,
            profession : profession,
            image : pimg
        })

        newProfile.save().then(
            req.session.message = {
                type : 'success',
                message : 'success !',
                desc : 'profile updated successfully'
            })
    
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

exports.Updateprofile = async( req,res ) => {
    try {
        const id = req.params.id
    const { username,gender,profession } = req.body
    let new_image = ''

    if(req.file)
    {
        new_image = req.file.filename
        try {
            fs.unlinkSync('profile/'+req.body.old_image)
        } catch (error) {
            console.log(error)
        }
    }
    else
    {
        new_image = req.body.old_image
    }

    Profile.findByIdAndUpdate(id,{
        username : username,
        gender : gender,
        profession : profession,
        image : new_image
    }).then(()=>{
        req.session.message = {
            type : 'success',
            message : 'success !',
            desc : 'profile updated successfully'
        }
        res.redirect('/')
    })
    } catch (error) {
      console.log(error)  
    }
}

exports.Logout = async( req,res ) => {
    req.session.destroy()
    res.redirect('/')
}

