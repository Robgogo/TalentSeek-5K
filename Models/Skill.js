const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema=new Schema({
    skill:{type:String,required:true,trim:true},
    yearOfExp:{type:Number,default:1}
});

const Skill=mongoose.model('Skills',skillSchema);

module.exports=Skill;