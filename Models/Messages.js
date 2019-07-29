const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema=new Schema({
    to:{type: Schema.Types.ObjectId, ref:'User', required: true},
    from:{type: Schema.Types.ObjectId, ref:'User', required:true },
    message:{type: String, trim:true, required:true},
    isRead:{type: Boolean, default:false} 
},
{ timestamps:{
    createdAt: 'created_at'
    }
});

const Message=mongoose.model('Message',messageSchema);

module.exports=Message;