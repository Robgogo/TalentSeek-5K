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
    console.log("id is ",req.params.id);
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

router.post('/portfolio/edit',function(req,res){
    Portfolio.findById(req.body.id).then((portfolio)=>{
        if(!portfolio){
            return res.status(400).json({message:"Couold not find portfolio, try again later"});
        }
        portfolio.projectTitle=req.body.projectTitle;
        portfolio.projectDescription=req.body.description;
        portfolio.link=req.body.link;
        portfolio.save().then( portfolio => {
            return res.json({portfolio});
        });
    });
});

router.post('/edex/edit',function(req,res){
    if(req.body.isEducation && !req.body.isExperience && !req.body.isAvailablity){
        Education.findById(req.body.educationId).then((education)=>{
            if(!education){
                return res.status(400).json({message:"Couold not find education entry, try again later"});
            }
            education.school=req.body.school;
            education.startYear=req.body.startYear;
            education.endYear=req.body.endYear;
            education.qualification=req.body.qualification;
            education.save().then( education => {
                return res.json({education});
            });
        });
    }
    if(!req.body.isEducation && req.body.isExperience && !req.body.isAvailablity){
        Experience.findById(req.body.experienceId).then((experience)=>{
            if(!experience){
                return res.status(400).json({message:"Couold not find experience entry, try again later"});
            }
            experience.company=req.body.company;
            experience.startDate=req.body.startDate;
            experience.endDate=req.body.endDate;
            experience.save().then( experience => {
                return res.json({experience});
            });
        });
    }
    if(!req.body.isEducation && !req.body.isExperience && req.body.isAvailablity){
        Availability.findById(req.body.availabilityId).then((availability)=>{
            if(!availability){
                return res.status(400).json({message:"Couold not find availability entry, try again later"});
            }
            availability.isAvailable=req.body.isAvailable;
            availability.nextAvailable=req.body.nextAvailable;
            availability.save().then( availability => {
                return res.json({availability});
            }); 
        });
    }
    if(req.body.isEducation && req.body.isExperience && req.body.isAvailablity){
        Education.findById(req.body.educationId).then((education)=>{
            if(!education){
                return res.status(400).json({message:"Couold not find education entry, try again later"});
            }
            education.school=req.body.school;
            education.startYear=req.body.startYear;
            education.endYear=req.body.endYear;
            education.qualification=req.body.qualification;
            education.save().then( (education) => {
                Experience.findById(req.body.experienceId).then((experience)=>{
                    if(!experience){
                        return res.status(400).json({message:"Couold not find experience entry, try again later"});
                    }
                    experience.company=req.body.company;
                    experience.startDate=req.body.startDate;
                    experience.endDate=req.body.endDate;
                    experience.save().then( (experience) => {
                        Availability.findById(req.body.availabilityId).then((availability)=>{
                            if(!availability){
                                return res.status(400).json({message:"Couold not find availability entry, try again later"});
                            }
                            availability.isAvailable=req.body.isAvailable;
                            availability.nextAvailable=req.body.nextAvailable;
                            availability.save().then( (availability) => {
                                return res.json({education,experience,availability});
                            }).catch( err => {
                                return res.status(500).json({message:"Could not Update!"});
                            });
                        }).catch( err => {
                            return res.status(500).json({message:"Could not Update!"});
                        });
                    }).catch( err => {
                        return res.status(500).json({message:"Could not Update!"});
                    });
                }).catch( err => {
                    return res.status(500).json({message:"Could not Update!"});
                });
            }).catch( err => {
                return res.status(500).json({message:"Could not Update!"});
            });
        });
    }
});

router.post('/education/edit',function(req,res){
    Education.findById(req.body.id).then((education)=>{
        if(!education){
            return res.status(400).json({message:"Couold not find education entry, try again later"});
        }
        education.school=req.body.school;
        education.startYear=req.body.startYear;
        education.endYear=req.body.endYear;
        education.qualification=req.body.qualification;
        education.save().then( education => {
            return res.json({education});
        });
    });
});

router.post('/experience/edit',function(req,res){
    Experience.findById(req.body.id).then((experience)=>{
        if(!experience){
            return res.status(400).json({message:"Couold not find experience entry, try again later"});
        }
        experience.company=req.body.company;
        experience.startDate=req.body.startDate;
        experience.endDate=req.body.endDate;
        experience.save().then( experience => {
            return res.json({experience});
        });
    });
});

router.post('/availability/edit',function(req,res){
    Availability.findById(req.body.id)
    .then((availability)=>{
        if(!availability){
            return res.status(400).json({message:"Couold not find availability entry, try again later"});
        }
        availability.isAvailable=req.body.isAvailable;
        availability.nextAvailable=req.body.nextAvailable;
        availability.save().then( availability => {
            return res.json({availability});
        });
    });
});

//Delete request for resources

router.post('/portfolio/delete',function(req,res){
    Portfolio.findByIdAndDelete(req.body.id)
    .then((portfolio)=>{
        if(!portfolio){
            return res.status(400).json({message:"Couold not find portfolio, try again later"});
        }
        return res.json({message:"Successful",portfolio});
    });
});

router.post('/edex/delete',function(req,res){
    if(req.body.isEducation && !req.body.isExperience){
        Education.findByIdAndDelete(req.body.id).then((education)=>{
            if(!education){
                return res.status(400).json({message:"Couold not find education entry, try again later"});
            }
            return res.json({message:"Successful",education});
        });
    }
    if(!req.body.isEducation && req.body.isExperience){
        Experience.findByIdAndDelete(req.body.id).then((experience)=>{
            if(!experience){
                return res.status(400).json({message:"Couold not find experience entry, try again later"});
            }
            return res.json({message:"Successful",experience});
        });
    }
    if(req.body.isEducation && req.body.isExperience){
        Education.findByIdAndDelete(req.body.educationId).then((education)=>{
            if(!education){
                return res.status(400).json({message:"Couold not find education entry, try again later"});
            }
            Experience.findByIdAndDelete(req.body.id).then((experience)=>{
                if(!experience){
                    return res.status(400).json({message:"Couold not find experience entry, try again later"});
                }
                return res.json({message:"Successful",education,experience}); 
            });
        });
    }
});

router.post('/education/delete',function(req,res){
    Education.findByIdAndDelete(req.body.id).then((education)=>{
        if(!education){
            return res.status(400).json({message:"Couold not find education entry, try again later"});
        }
        return res.json({message:"Successful",education});
    });
});

router.post('/experience/delete',function(req,res){
    Experience.findByIdAndDelete(req.body.id).then((experience)=>{
        if(!experience){
            return res.status(400).json({message:"Couold not find experience entry, try again later"});
        }
        return res.json({message:"Successful",experience});
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
            return res.json({message:"Succesfull",portfolio});      
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
