const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema=new Schema({
    skill:{type:String,required:true,trim:true},
    level:{type:String,required:true},
    yearOfExp:{type:Number}
});

const Skill=mongoose.model('Skills',skillSchema);

module.exports=Skill;