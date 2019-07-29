const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bioSchema = new Schema({
  user:{type: Schema.Types.ObjectId,ref:'User', required:true},
  interest:{type:String,required:true,trim:true},
  about:{type:String,required:true,trim:true}
});

const Bio = mongoose.model('Bio', bioSchema);

module.exports = Bio;