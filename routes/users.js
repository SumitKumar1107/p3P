const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


//Login Page
router.get('/login',(req,res)=>res.render('login'));

//Register Page
router.get('/register',(req,res)=>res.render('register'));

//Register Handle
router.post('/register',(req,res)=>{
    const {name,email,location,password,password2} = req.body;
    let errors = [];
    
    //Checking 1
    if(!name || !email || !password || !password2 || !location)
    {
        errors.push({msg:'Please fill in all fields'});
    }
    //Checking 2
    if(password !== password2)
    {
        errors.push({msg:'Passwords do not match'})
    }
    //Checking 3
    if(password.length < 6)
    {
        errors.push({msg:'Password should be at least 6 characters'}) 
    }
    
    if(errors.length>0)
    {
        res.render('register',{
            errors,
            name,
            email,
            location,
            password,
            password2
        });
    }
    else
    {
        //validation passed
        User.findOne({email:email})
            .then(user => {
                if(user)
                {
                    //user exists
                    errors.push({msg:'Email is already registered'}); 
                    res.render('register',{
                       errors,
                       name,
                       email,
                       location,
                       password,
                       password2
                });
                }
                else
                {
                    const newUser = new User({
                        name,
                        email,
                        location,
                        password
                    });
                    
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(user => {
                        req.flash(
                        'success_msg',
                        'You are now registered and can log in'
                    );
                        res.redirect('/users/login');
                })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//login handle
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})

module.exports = router;