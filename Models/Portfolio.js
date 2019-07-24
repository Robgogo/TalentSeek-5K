const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema=new Schema({
  user:{type: Schema.Types.ObjectId,ref:'User', required:true},
  projectTitle:{type:String,trim:true},
  projectDescription:{type:String,trim:true},
  link:{type:String,trim:true}
});

const Portfolio=mongoose.model('Portfolio',portfolioSchema);

module.exports=Portfolio;