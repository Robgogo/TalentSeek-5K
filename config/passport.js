const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt= require('bcryptjs');

const User = require("../Models/User");

passport.use(new LocalStrategy({
    usernameField: 'email'
},function(email,password,done){
    User.findOne({
        email:email.toLowerCase()
    }).then((user)=>{
        if(!user){
            return done(null,false,{message: `No user can be found by this ${email}`});
        }
        bcrypt.compare(password,user.password,(err,isaMatch)=>{
            if(err){
                throw err;
            }
            if(isaMatch){
                return done(null,{user});
            }
            else{
                return done(null,false,{message:"Incorrect username or password"});
            }
        });
    });
}
));

passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        return done(err, user);
      });
  });
  