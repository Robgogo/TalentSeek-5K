const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const educationSchema=new Schema({
  user:{type: Schema.Types.ObjectId,ref:'User', required:true},
  school:{type: String,trim:true},
  startYear:{type: Date},
  endYear:{type:Date},
  qualification:{type: String,trim:true},
  cgpa:{type: Number}
});

const Education=mongoose.model('Education',educationSchema);

module.exports=Education;