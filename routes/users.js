var express = require('express');
var router = express.Router();
const User = require('../Models/User');
const Education = require('../Models/Education');
const Experience = require('../Models/Experience');
const Portfolio = require('../Models/Portfolio');
const Bio = require('../Models/Bio');
const Availability = require('../Models/Availability');
const Review = require('../Models/Review');
const Message = require('../Models/Messages');
var constants = require('../config/constants');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const FuzzySearch = require('fuzzy-search');


/* GET users listing. */
// router.get('/login', function(req, res, next) {
//   res.json({message:'respond with a resource'});
// });


router.post('/signup', (req, res) => {
  User.findOne({
    email: req.body.emailAddress.toLowerCase()
  }).then(user => {
    let em = req.body.emailAddress.split("@");
    if (em[1] !== 'gmail.com') {
      return res.json({ message: "A user with email address domain of moderneth can sign up." });
    }
    if (user) {
      return res.json({ message: "A user with this email already exists." });
    }
    const newUser = new User({
      email: req.body.emailAddress.toLowerCase(),
      password: req.body.pass,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      dateOfBirth: req.body.dob,
      isTalent: req.body.isTalent
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;

        newUser.save().then(user => {
          return res.json({ message: "registration succesfull", isAuthenticated: true, user: user });
        });
      });
    });
  });
});


router.post('/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Incorrect email or Password",
        user: user
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user, constants.SECRET_KEY);
      return res.json({ user, token, isFirstTime: user.firstTime });
    });
  })(req, res);
  // res.status(200);
  // return res.json({message:"Succesfull"});
});

router.get('/profile/:id', function (req, res) {
  User.findById(req.params.id).then(user => {
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } Portfolio.find({ user: user._id }).then(portfolio => {
      Experience.find({ user: user._id }).then(experience => {
        Education.find({ user: user._id }).then(education => {
          Availability.find({ user: user._id }).then(availabilty => {
            return res.json({ portfolio, education, experience, availabilty });
          }).catch(err => {
            return res.status(500).json({ message: "Could not find portfolio for user" });
          });
        }).catch(err => {
          return res.status(500).json({ message: "Could not find portfolio for user" });
        });
      }).catch(err => {
        return res.status(500).json({ message: "Could not find portfolio for user" });
      });
    }).catch(err => {
      return res.status(500).json({ message: "Could not find portfolio for user" });
    });
    if (!user.isTalent) {
      return res.status(400).json({ message: "User is not talent" });
    }

  }).catch(err => {
    return res.status(400).json({ message: "Error" });
  });
});

router.get('/review/:id', function (req, res) {
  User.findById(req.params.id).then(user => {
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.isTalent) {
      return res.status(400).json({ message: "Recruiter ca not have review" });
    }
    Review.find({ to: user.__id }).then(review => {
      if (!review) {
        return res.status(400).json({ message: "review not found for user" });
      }
      let avgRating = 0;
      for (var i = 0; i < review.length(); i++) {
        avgRating += (review[i].review / 3);
      }
      return res.json({ review, averageRating: avgRating })
    }).catch(err => {
      return res.status(500).json({ message: "Error" });
    });
  }).catch(err => {
    return res.status(500).json({ message: "Error" });
  });
});

router.post('/review', function (req, res) {
  User.findById(req.body.to).then(to => {
    if (!to) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!to.isTalent) {
      return res.status(400).json({ message: "Can't review a recruiter" });
    }
    User.findById(req.body.from).then(from => {
      if (!from) {
        return res.status(400).json({ message: "User not found" });
      }
      if (from.isTalent) {
        return res.status(400).json({ message: "A talent can not give a review" });
      }
      const newReview = new Review({
        to: to._id,
        from: from.__id,
        review: req.body.review,
        rating: req.body.rating
      });
      newReview.save().then(review => {
        if (!review) {
          return res.status(500).json({ message: "Something went wrong, try again later" });
        }
        return res.json({ message: 'Successful', review });
      });
    });
  });
});

router.get('/messages/:id', function (req, res) {
  User.findById(req.params.id).then(user => {
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    Message.find({ to: user._id }).then(messages => {
      if (!messages) {
        return res.status(500).json({ message: "Could not find messagesfor the user", messages });
      }
      return res.json({ message: "Successful", messages });
    }).catch(err => {
      return res.status(500).json({ message: "Error" });
    });
  }).catch(err => {
    return res.status(500).json({ message: "Error" });
  });
});

router.get('/messages/read/:id', function (req, res) {
  Message.findById(req.params.id).then(msg => {
    if (!msg) {
      return res.status(400).json({ message: "Messge not foud" });
    }
    User.findById(msg.from).then(user => {
      if (!user) {
        return res.status(400).json({ message: "User could not be identified" });
      }
      let name = user.firstname + " " + user.lastname;
      let count = user.unreadCount;
      user.unreadCount = count - 1;
      user.save().then(user => {
        return res.json({ message: "Successful", msg, from: name });
      }).catch(err => {
        return res.status(500).json({ message: "Error" });
      });
    }).catch(err => {
      return res.status(500).json({ message: "Error" });
    });
  }).catch(err => {
    return res.status(500).json({ message: "Error" });
  });
});

router.post('/message', function (req, res) {
  User.findById(req.body.to).then(user => {
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    User.findById(req.body.from).then(usr => {
      if (!usr) {
        return res.status(400).json({ message: "User not found" });
      }
      const newMessage = new Message({
        to: user._id,
        from: usr._id,
        message: req.body.message
      });
      newMessage.save().then(msg => {
        let count = user.unreadCount;
        user.unreadCount = count + 1;
        user.save().then(users => {
          return res.json({ message: "Successful", newMessage: msg });
        }).catch(err => {
          return res.status(500).json({ message: "Error while saving" });
        });
      }).catch(err => {
        return res.status(500).json({ message: "Error" });
      });
    }).catch(err => {
      return res.status(500).json({ message: "Error" });
    });
  }).catch(err => {
    return res.status(500).json({ message: "Error" });
  });
});

//fix this code to check for talents and return only talents!!!
router.get('/latest', function (req, res) {
  let result = [];
  User.find().then(users => {
    for (var i = 0; i < 7; i++) {
      Portfolio.find({ user: users[users.length() - 1 - i]._id }).then(portfolio => {
        Experience.find({ user: users[users.length() - 1 - i]._id }).then(experience => {
          Education.find({ user: users[users.length() - 1 - i]._id }).then(education => {
            Availability.find({ user: users[users.length() - 1 - i]._id }).then(availabilty => {
              let newObj = {
                user: users[users.length() - 1 - i],
                portfolio: portfolio,
                experience: experience,
                education: education,
                availabilty: availabilty
              };
              result.push(newObj);
            }).catch(err => {
              return res.status(500).json({ message: "Could not find Availability for user" });
            });
          }).catch(err => {
            return res.status(500).json({ message: "Could not find Education for user" });
          });
        }).catch(err => {
          return res.status(500).json({ message: "Could not find Experience for user" });
        });
      }).catch(err => {
        return res.status(500).json({ message: "Could not find portfolio for user" });
      });
    }
    return res.json({ message: "Successful", result });
  });
});

router.post('/search', function (req, res) {
  if (!req.body.search) {
    let result = [];
    User.find().then(users => {
      for (var i = 0; i < users.length(); i++) {
        if (users[i].isTalent) {
          Portfolio.find({ user: users[i]._id }).then(portfolio => {
            Experience.find({ user: users[i]._id }).then(experience => {
              Education.find({ user: users[i]._id }).then(education => {
                Availability.find({ user: users[i]._id }).then(availabilty => {
                  let newObj = {
                    user: users[i],
                    portfolio: portfolio,
                    experience: experience,
                    education: education,
                    availabilty: availabilty
                  };
                  result.push(newObj);
                }).catch(err => {
                  return res.status(500).json({ message: "Could not find Availability for user" });
                });
              }).catch(err => {
                return res.status(500).json({ message: "Could not find Education for user" });
              });
            }).catch(err => {
              return res.status(500).json({ message: "Could not find Experience for user" });
            });
          }).catch(err => {
            return res.status(500).json({ message: "Could not find portfolio for user" });
          });
        }
      }
      return res.json({ message: "Successful", result });
    });
  }
  else {
    let temp = [];
    User.find().then(users => {
      for (var i = 0; i < users.length(); i++) {
        if (users[i].isTalent) {
          Portfolio.find({ user: users[i]._id }).then(portfolio => {
            Experience.find({ user: users[i]._id }).then(experience => {
              Education.find({ user: users[i]._id }).then(education => {
                Availability.find({ user: users[i]._id }).then(availabilty => {
                  let newObj = {
                    user: users[i],
                    portfolio: portfolio,
                    experience: experience,
                    education: education,
                    availabilty: availabilty
                  };
                  temp.push(newObj);
                }).catch(err => {
                  return res.status(500).json({ message: "Could not find Availability for user" });
                });
              }).catch(err => {
                return res.status(500).json({ message: "Could not find Education for user" });
              });
            }).catch(err => {
              return res.status(500).json({ message: "Could not find Experience for user" });
            });
          }).catch(err => {
            return res.status(500).json({ message: "Could not find portfolio for user" });
          });
        }
      }
      const searcher = new FuzzySearch(temp, ['user.email', 'user.firstname', 'user.lastname', 'portfolio.projectTitle',
        'experience.company', 'education.qualification', 'education.cgpa', 'education.school'], { caseSensitive: false });
      const result = searcher.search(req.body.search);
      return res.json({ message: "Successful", result });
    });
  }
});

module.exports = router;