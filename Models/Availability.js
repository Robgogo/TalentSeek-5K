const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const availabilitySchema=new Schema({
    user:{type: Schema.Types.ObjectId,ref:'User', required:true},
    isAvailable:{type:Boolean,required:true},
    nextAvailable:{type:Date}
});

const Availabilty=mongoose.model('Availabilty',availabilitySchema);

module.exports=Availabilty;