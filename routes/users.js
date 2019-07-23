var express = require('express');
var router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

/* GET users listing. */
// router.get('/login', function(req, res, next) {
//   res.json({message:'respond with a resource'});
// });
router.post('/signup',(req,res)=>{
  // console.log("Request is: ",req.body.firstName);
  User.findOne({
    email:req.body.email
  }).then(user=>{
    if(user){
      return res.json({message:"A user with this email already exists."});
    }
    const newUser=new User({
      email:req.body.emailAddress,
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
  passport.authenticate('local')(req,res,next);
  res.status(200);
  return res.json({message:"Succesfull"});
});

module.exports = router;
