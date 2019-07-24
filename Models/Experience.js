const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema=new Schema({
    user:{type: Schema.Types.ObjectId,ref:'User', required:true},
    company:{type: String,trim:true},
    startDate:{type: Date,required:true},
    endDate:{type:Date,default:null},

});

const Experience=mongoose.model('Experience',experienceSchema);

module.exports=Experience;