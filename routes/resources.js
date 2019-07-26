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
        if(!user){
            return res.status(500).json({message:"no Data for this user!",data:null});
        }
        Bio.find({user:user._id})
        .then((bio)=>{
            if(!bio){
                return res.status(500).json({message:"Could not fetch data, try again later!",data:null});
            }
            return res.json({bio});
        }).catch( (err) => {
            return res.status(500).json({message:"Could not fetch data, try again later!",data:null});
        });
    }).catch( (err) => {
        return res.status(500).json({message:"Could not fetch data, try again later!",data:null});
    });
});

router.get('/portfolio/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Portfolio.find({user:user._id})
        .then((portfolio)=>{
            if(!portfolio){
                return res.status(500).json({message:"Could not fetch data, try again later!",data:null});
            }
            return res.json({portfolio});
        }).catch( (err) => {
            return res.status(500).json({message:"Could not fetch data, try again later!"});
        });
    }).catch( (err) => {
        return res.status(500).json({message:"Could not fetch data, try again later!"});
    });
});

router.get('/edex/:id',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Education.find({user:user._id})
        .then((education)=>{
            if(!education){
                return res.status(500).json({message:"Could not fetch data, try again later!"});
            }
            Experience.find({user:user._id})
            .then((experience)=>{
                if(!experience){
                    return res.status(500).json({message:"Could not fetch data, try again later!"});
                }
                Availability.find({user:user._id})
                .then((availability)=>{
                    if(!availability){
                        return res.status(500).json({message:"Could not fetch data, try again later!"});
                    }
                    return res.json({education,experience,availability});
                }).catch( (err) => {
                    return res.status(500).json({message:"Could not fetch data, try again later!"});
                });
            }).catch( (err) => {
                return res.status(500).json({message:"Could not fetch data, try again later!"});
            });
        }).catch( (err) => {
            return res.status(500).json({message:"Could not fetch data, try again later!"});
        });
    }).catch( (err) => {
        return res.status(500).json({message:"Could not fetch data, try again later!"});
    });
});

// router.get('/experience/:id',function(req,res){
//     User.findById(req.params.id).then((user)=>{
//         Experience.findOne({user:user.id})
//         .then((experience)=>{
//             return res.json({experience});
//         });
//     }).catch( (err) => {
//         return res.json({message:"Could not fetch data, try again later!"});
//     });
// });

// router.get('/availability/:id',function(req,res){
//     User.findById(req.params.id).then((user)=>{
//         Availability.findOne({user:user.id})
//         .then((availability)=>{
//             return res.json({availability});
//         });
//     });
// });

//Update request for resources

router.post('/bio/:id/:bioId',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Bio.findOne({user:user._id,_id:req.params.bioId})
        .then((bio)=>{
            bio.interest=req.body.interest;
            let skl=[...bio.skill];
            for(i=0;i<req.body.skill.length();i++)
                skl.push(req.body.skill[i]);
            bio.skill=skl;
            bio.save();
            return res.json({bio});
        }).catch( (err) => {
            return res.json({message:"Could not fetch data, try again later!"});
        });
    }).catch( (err) => {
        return res.json({message:"Could not fetch data, try again later!"});
    });
});

router.post('/portfolio/:id/:prtId',function(req,res){
    User.findById(req.params.id).then((user)=>{
        Portfolio.findOne({user:user._id,_id:req.params.prtId})
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

//Create request of resources

router.post('/bio',function(req,res){
    User.findById(req.body.id).then((user)=>{
        let path='';
        upload(req,res,function(err){
            if(err){
                return res.status(422).json({messge:"an Error occured while uploading"});
            }
            Path=req.file.path;
            const profile = new Profile;
            profile.img.data=fs.readFileSync(path);
            profile.img.contentType = 'image/jpeg';
            profile.user=user.id;
            profile.save(function(err,profile){
                if(err){
                    return res.status(500).json({message:"Something went wrong while saving to database, try again later"}); 
                }
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
                newBio.save().then( (bio) => {
                    return res.json({messge:"Saved Bio succesfully",bio});
                }).catch( (err) =>{
                    return res.status(500).json({message:"Something went wrong, try again later"});
                });
            });
        }).catch( (err) =>{
            return res.status(500).json({message:"Something went wrong, try again later"});
        });       
    }).catch( (err) =>{
        return res.status(500).json({message:"Something went wrong, try again later"});
    });
});

router.post('/portfolio',function(req,res){
    User.findById(req.body.id).then( (user) => {
        const portfolio = new Portfolio({
            user:user._id,
            projectTitle:req.body.projectTitle,
            projectDescription:req.body.description,
            link:req.body.link
        });
        portfolio.save().then( (portfolio) => {
            Bio.findOne({user:user._id}).then( (bio) => {
                if(!bio){
                    return res.status(400).json({message:"could not find bio for the user!"});
                }
                bio.portfolio=portfolio._id;
                bio.save().then( (bio) => {
                    return res.json({message:"Succesfull",portfolio});
                }).catch( (err) =>{
                    return res.status(500).json({message:"Something went wrong while saving bio info in portfolio, try again later"});
                });
            }).catch( (err) =>{
                return res.status(500).json({message:"Something went wrong, try again later"});
            });
        }).catch( (err) =>{
            return res.status(500).json({message:"Something went wrong while saving portfolio, try again later"});
        });
        
    }).catch( (err) =>{
        return res.status(500).json({message:"Something went wrong, try again later"});
    });
});

router.post('/edex',function(req,res){
    User.findById(req.body.id).then( (user) => {
        const education = new Education({
            user:user._id,
            school:req.body.school,
            qualification:req.body.qualification,
            startYear:req.body.startYear,
            endYear:req.body.endYear,
            cgpa:req.body.cgpa
        });
        education.save().then( (education) =>{
            const experience = new Experience({
                user:user._id,
                company:req.body.companyName,
                startDate:req.body.startDate,
                endDate:req.body.endDate
            });
            experience.save().then( (experience) => {
                const availability = new Availability;
                
                availability.user=user._id;
                availability.isAvailable=req.body.availability;
                if(req.body.availability!==true)
                    availabilty.nextAvailable=req.body.nextDate;
                availability.save().then((availability)=>{
                    return res.json({message:"Succesful",education,experience,availability});
                }).catch( (err) =>{
                    return res.status(500).json({message:"Something went wrong, try again later"});
                });
                }).catch( (err) =>{
                    return res.status(500).json({message:"Something went wrong, try again later"});
                });
        }).catch( (err) =>{
            return res.status(500).json({message:"Something went wrong, try again later"});
        });
    }).catch( (err) =>{
        return res.status(500).json({message:"Something went wrong, try again later"});
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
