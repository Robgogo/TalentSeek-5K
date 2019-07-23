const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true , trim:true},
  lastname:  { type: String, required: true , trim:true},
  email: { type: String, required: true, trim:true },
  password: {type:String, required: true} ,
  isTalent:{ type: Boolean, required: true, },
  dateOfBirth: { type: Date, default: null, required: true}
});

const User = mongoose.model('Users-demo', userSchema);

module.exports = User;