const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema=new Schema({
    to:{type: Schema.Types.ObjectId, ref:'User', required: true},
    from:{type: Schema.Types.ObjectId, ref:'User', required:true },
    review:{type: String, trim:true},
    rating:{type: Number, default:0} 
},{timestamps:{
    createdAt: 'created_at'
}});

const Review=mongoose.model('Review',reviewSchema);

module.exports=Review;