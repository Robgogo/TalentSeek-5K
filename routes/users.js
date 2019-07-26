var express = require('express');
var router = express.Router();
const User = require('../Models/User');
const Education = require('../Models/Education');
const Experience = require('../Models/Experience');
const Portfolio = require('../Models/Portfolio');
const Bio = require('../Models/Bio');
const Availability = require('../Models/Availability');
var constants=require('../config/constants');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt=require('jsonwebtoken');


/* GET users listing. */
// router.get('/login', function(req, res, next) {
//   res.json({message:'respond with a resource'});
// });


router.post('/signup',(req,res)=>{
  User.findOne({
    email:req.body.emailAddress.toLowerCase()
  }).then(user=>{
    let em=req.body.emailAddress.split("@");
    if(em[1]!=='gmail.com'){
      return res.json({message:"A user with email address domain of moderneth can sign up."});
    }
    if(user){
      return res.json({message:"A user with this email already exists."});
    }
    const newUser=new User({
      email:req.body.emailAddress.toLowerCase(),
      password:req.body.pass,
      firstname:req.body.firstName,
      lastname:req.body.lastName,
      dateOfBirth:req.body.dob,
      isTalent:req.body.isTalent
    });
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(newUser.password,salt, (err,hash)=>{
        newUser.password=hash;

        newUser.save().then( user =>{
          return res.json({message:"registration succesfull",isAuthenticated:true,user:user});
        });
      });
    });
  });
});


router.post('/login',function(req,res,next){
  passport.authenticate('local',{session:false},(err,user,info)=>{
    if(err||!user){
      return res.status(400).json({
        message:"Incorrect email or Password",
        user:user
      });
    }
    
    req.login(user,{session:false}, (err)=>{
      if(err){
        res.send(err);
      }

      const token=jwt.sign(user,constants.SECRET_KEY);
      let newUser=new User;
      newUser=user;
      newUser.token=token;
      console.log("User is: ",newUser);
      newUser.save();

      return res.json({user,token,isFirstTime:user.firstTime});
    });
  })(req,res);
  // res.status(200);
  // return res.json({message:"Succesfull"});
});

router.post('/profile/:id',function(req,res,next){

});

router.put('/profile/:id',function(req,res,next){
  
});

router.get('/profile/:id',function(req,res,next){
  
});

module.exports = router;