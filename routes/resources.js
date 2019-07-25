var express = require('express');
var router = express.Router();
var User = require('../Models/User');
var Education= require('../Models/Education');
var Bio= require('../Models/Bio');
var Experience= require('../Models/Experience');
var Portfolio= require('../Models/Portfolio');
var Availability= require('../Models/Availability');
var Profile = require('../Models/Profilepicture');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploads/')
    }
});


const upload = multer({ storage: storage }).single('photo');


router.get('/bio/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Bio.findOne({user:user.id})
        .then((bio)=>{
            return res.json({bio});
        });
    });
});

router.get('/portfolio/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Portfolio.findOne({user:user.id})
        .then((portfolio)=>{
            return res.json({portfolio});
        });
    });
});

router.get('/education/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Education.findOne({user:user.id})
        .then((education)=>{
            return res.json({education});
        });
    });
});

router.get('/experience/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Experience.findOne({user:user.id})
        .then((experience)=>{
            return res.json({experience});
        });
    });
});

router.get('/availability/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Availability.findOne({user:user.id})
        .then((availability)=>{
            return res.json({availability});
        });
    });
});

router.put('/bio/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Bio.findOne({user:user.id})
        .then((bio)=>{
            bio.interest=req.body.interest;
            let skl=[...bio.skill];
            for(i=0;i<req.body.skill.length();i++)
                skl.push(req.body.skill[i]);
            bio.skill=skl;
            bio.save();
            return res.json({bio});
        });
    });
});

router.put('/portfolio/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Portfolio.findOne({user:user.id})
        .then((portfolio)=>{
            portfolio.projectTitle=req.body.projectTitle;
            portfolio.projectDescription=req.body.description;
            portfolio.link=req.body.link;
            portfolio.save();
            return res.json({portfolio});
        });
    });
});

router.put('/education/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Education.findOne({user:user.id})
        .then((education)=>{
            education.school=req.body.school;
            education.startYear=req.body.startYear;
            education.endYear=req.body.endYear;
            education.qualification=req.body.qualification;
            education.save();
            return res.json({education});
        });
    });
});

router.put('/experience/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Experience.findOne({user:user.id})
        .then((experience)=>{
            experience.company=req.body.company;
            experience.startDate=req.body.startDate;
            experience.endDate=req.body.endDate;
            experience.save();
            return res.json({experience});
        });
    });
});

router.put('/availability/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Availability.findOne({user:user.id})
        .then((availability)=>{
            availability.isAvailable=req.body.isAvailable;
            availability.nextAvailable=req.body.nextAvailable;
            availability.save();
            return res.json({availidability});
        });
    });
});

router.post('/bio',function(req,res){
    User.findById(req.body.id).then((user)=>{
        let path='';
        upload(req,res,function(err){
            if(err){
                return res.status(422).jsom({messge:"an Error occured while uploading"});
            }
            Path=req.file.path;
            const profile = new Profile;
            profile.img.data=fs.readFileSync(path);
            profile.img.contentType = 'image/jpeg';
            profile.user=user.id;
            profile.save(function(err,profile){
                let skl=[...bio.skill];
                for(i=0;i<req.body.skill.length();i++)
                    skl.push(req.body.skill[i]);
                const newBio=new Bio({
                    interest:req.body.interest,
                    skill:skl,
                    about:req.body.aboutMe,
                    user:user.id,
                    profilePicture:profile.id
                });
                return res.json({messge:"Saved Bio succesfully",newBio}); 
            });
        });       
    });
});

router.post('/portfolio',function(req,res){
    User.findOne(req.body.id).then( (user) => {
        const portfolio = new Portfolio({
            user:user.id,
            projectTitle:req.body.projectTitle,
            projectDescription:req.body.description,
            link:req.body.link
        });
        Bio.findOne({user:user.id}).then( (bio) => {
            bio.portfolio=portfolio.id;
            bio.save();
            return res.json({message:"Succesfully added your portfolio",portfolio});
        });
    }).catch( (err) =>{
        return res.json({message:"Something went wrong, try again later"});
    });
});

router.post('/edex',function(req,res){
    User.findOne(req.body.id).then( (user) => {
        const education = new Education({
            user:user.id,
            school:req.body.school,
            qualification:req.body.qualification,
            startYear:req.body.startYear,
            endYear:req.body.endYear,
            cgpa:req.bosy.cgpa
        });
        const experience = new Experience({
            user:user.id,
            company:req.body.companyName,
            startDate:req.body.startDate,
            endDate:req.body.endDate
        });
        const availability = new Availability;
        if(req.body.availability===true){
            availability.user=user.id;
            availability.isAvailable=req.body.availability;
            availability.save();
        }
        else{
            availabilty.user=user.id;
            availabilty.isAvailable=req.body.availability;
            availabilty.nextAvailable=req.body.nextDate;
            availability.save();
        } 
        return res.json({message:"Succesfully added Education,Experience and set your availabilty",education,experience,availability});
    }).catch( (err) =>{
        return res.json({message:"Something went wrong, try again later"});
    });;
});

// router.post('/experience',function(req,res){
//     User.findOne(req.body.user.id).then( (user) => {
        
//         return res.json({message:"Succesfully added experience",experience});
//     });
// });

// router.post('/availability',function(req,res){
//     User.findOne(req.body.user.id).then( (user) => {
        
//         return res.json({message:"Succesfully set your availability status",availability});
//     });
// });

module.exports = router;
