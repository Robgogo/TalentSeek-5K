const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user:{type: Schema.Types.ObjectId,ref:'User', required:true},
  img:{data:Buffer,contentType:String}    
},{timestamps:true});

const Profile = mongoose.model('Profile',profileSchema);

module.exports = Profile;